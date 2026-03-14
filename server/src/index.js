import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'https://qrgen.studio',
  'http://qrgen.studio',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Validation helpers
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Create Stripe Checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { quantity, successUrl, cancelUrl, customerEmail, promoCode } = req.body

    // Validate quantity
    const itemQuantity = parseInt(quantity, 10) || 1
    if (itemQuantity < 1 || itemQuantity > 100) {
      return res.status(400).json({ error: 'Quantity must be between 1 and 100' })
    }

    // Validate URLs
    if (successUrl && !isValidUrl(successUrl)) {
      return res.status(400).json({ error: 'Invalid success URL' })
    }
    if (cancelUrl && !isValidUrl(cancelUrl)) {
      return res.status(400).json({ error: 'Invalid cancel URL' })
    }

    // Validate email if provided
    if (customerEmail && !isValidEmail(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Validate promo code format (alphanumeric only)
    if (promoCode && !/^[A-Z0-9]{1,20}$/i.test(promoCode)) {
      return res.status(400).json({ error: 'Invalid promo code format' })
    }

    console.log('Creating checkout session:', { quantity: itemQuantity, customerEmail, promoCode })

    // Check for promo codes (you can store these in a database)
    let discountAmount = 0
    let discountPercent = 0
    let validPromoCode = null
    
    // Define promo codes (in production, store in database)
    const promoCodes = {
      'LAUNCH20': { type: 'percent', value: 20 },
      'FIRST50': { type: 'percent', value: 50 },
      'QRFREE': { type: 'percent', value: 100 },
      'SAVE10': { type: 'fixed', value: 10 }, // $10 off
    }
    
    if (promoCode && promoCodes[promoCode.toUpperCase()]) {
      validPromoCode = promoCodes[promoCode.toUpperCase()]
      if (validPromoCode.type === 'percent') {
        discountPercent = validPromoCode.value
      } else if (validPromoCode.type === 'fixed') {
        discountAmount = validPromoCode.value * 100 // Convert to cents
      }
    }

    // Calculate final price
    const basePrice = 199 // $1.99 in cents
    let finalPrice = basePrice
    
    if (discountPercent > 0) {
      finalPrice = Math.max(0, basePrice - Math.floor(basePrice * discountPercent / 100))
    } else if (discountAmount > 0) {
      finalPrice = Math.max(0, basePrice - discountAmount)
    }

    // Build product description
    let description = itemQuantity > 1 
      ? `${itemQuantity} high-quality QR codes`
      : 'High-quality QR code in PNG, SVG, and JPEG formats'
    
    if (validPromoCode) {
      description += ` (${promoCode.toUpperCase()} applied)`
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      allow_promotion_codes: true, // Allow Stripe's built-in promo code feature
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'QR Code Download',
              description,
            },
            unit_amount: finalPrice,
          },
          quantity: itemQuantity,
        },
      ],
      success_url: successUrl || `${req.headers.origin || process.env.FRONTEND_URL}?payment=success`,
      cancel_url: cancelUrl || `${req.headers.origin || process.env.FRONTEND_URL}?payment=cancelled`,
      metadata: {
        product: 'qr-code-download',
        quantity: itemQuantity.toString(),
        promo_code: promoCode || '',
      },
    })

    console.log('Session created:', session.id)
    res.json({ 
      sessionId: session.id, 
      url: session.url,
      discount: validPromoCode ? { code: promoCode.toUpperCase(), ...validPromoCode } : null
    })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Verify payment session
app.get('/api/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    res.json({
      paid: session.payment_status === 'paid',
      status: session.payment_status,
    })
  } catch (error) {
    console.error('Verify error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Stripe webhook for payment confirmation
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return res.status(400).send('Webhook secret not configured')
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    console.log('Payment successful:', session.id, session.customer_email)
    // Here you could store payment info in a database
  }

  res.json({ received: true })
})

app.listen(PORT, () => {
  console.log(`QR Gen server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Allowed origins:`, allowedOrigins)
})