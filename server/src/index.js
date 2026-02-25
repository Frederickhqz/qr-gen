import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Create Stripe Checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'QR Code Download',
              description: 'High-quality QR code in PNG, SVG, and JPEG formats',
            },
            unit_amount: 199, // $1.99 in cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin || process.env.FRONTEND_URL}?payment=success`,
      cancel_url: cancelUrl || `${req.headers.origin || process.env.FRONTEND_URL}?payment=cancelled`,
      metadata: {
        product: 'qr-code-download',
      },
    })

    res.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Verify error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Stripe webhook for payment confirmation
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return res.status(400).send('Webhook secret not configured')
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Payment successful:', session.id, session.customer_email)
    // Here you could store payment info in a database
  }

  res.json({ received: true })
})

app.listen(PORT, () => {
  console.log(`QR Gen server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})