import { useState, useRef, useEffect, useCallback } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { qrTypes, categories, getQRTypeInfo, type QRType } from './utils/icons'
import { generateQRData, generatePlaceholderData } from './utils/qrData'
import { compressLogo, type CompressedLogo } from './utils/logoCompress'
import { dotStyles, cornerStyles, presets, type DotStyle, type CornerStyle } from './utils/styling'
import { getPlatformIcon, hasPlatformIcon, brandColors } from './utils/platformIcons'
import './index.css'

// Telegram WebApp type declarations
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        openInvoice: (url: string, callback?: (status: string) => void) => void
        close: () => void
        initDataUnsafe?: {
          user?: {
            id: number
            first_name: string
            username?: string
          }
        }
        platform?: string
        version?: string
      }
    }
    Stripe?: (key: string) => any
  }
}

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51OIlrLFwy1Dp0Oz7e91HFYojV1QCub1Wn9hLcpCqrlOSjGHbbToJk40BC8TN1hb1P1y42jntyVSNVd3RsJ8SZv2o00n01dmBet'

// API base URL for backend (n8n webhook)
const API_BASE = 'https://n8n.srv796810.hstgr.cloud/webhook'

// Popular cryptocurrencies
const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', scheme: 'bitcoin' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', scheme: 'ethereum' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', scheme: 'solana' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', scheme: 'ripple' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', scheme: 'bnb' },
  { id: 'ton', name: 'Toncoin', symbol: 'TON', scheme: 'ton' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', scheme: 'cardano' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', scheme: 'dogecoin' },
  { id: 'tron', name: 'TRON', symbol: 'TRX', scheme: 'tron' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', scheme: 'avalanche' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', scheme: 'ethereum' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', scheme: 'polygon' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', scheme: 'litecoin' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', scheme: 'polkadot' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', scheme: 'ethereum' },
  { id: 'shibainu', name: 'Shiba Inu', symbol: 'SHIB', scheme: 'ethereum' },
  { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM', scheme: 'cosmos' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM', scheme: 'stellar' },
  { id: 'monero', name: 'Monero', symbol: 'XMR', scheme: 'monero' },
  { id: 'aptos', name: 'Aptos', symbol: 'APT', scheme: 'aptos' },
]

// Price constant
const PRICE = 1.99

// Common download sizes
const DOWNLOAD_SIZES = [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]

// Form data type
interface FormData {
  url: string
  text: string
  ssid: string
  password: string
  security: string
  email: string
  subject: string
  body: string
  phone: string
  message: string
  firstName: string
  lastName: string
  company: string
  title: string
  website: string
  start: string
  end: string
  location: string
  description: string
  handle: string
  address: string
  amount: string
  cryptoCoin: string
  cryptoAddress: string
  cryptoAmount: string
}

const initialFormData: FormData = {
  url: '', text: '', ssid: '', password: '', security: 'WPA',
  email: '', subject: '', body: '', phone: '', message: '',
  firstName: '', lastName: '', company: '', title: '', website: '',
  start: '', end: '', location: '', description: '',
  handle: '', address: '', amount: '',
  cryptoCoin: 'bitcoin', cryptoAddress: '', cryptoAmount: ''
}

function App() {
  // Core state
  const [qrType, setQrType] = useState<QRType>('url')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [qr, setQr] = useState<QRCodeStyling | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)
  
  // Style state
  const [dotsStyle, setDotsStyle] = useState<DotStyle>('square')
  const [cornersStyle, setCornersStyle] = useState<CornerStyle>('square')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgTransparent, setBgTransparent] = useState(false)
  const [gradientEnabled, setGradientEnabled] = useState(false)
  const [gradientColor1, setGradientColor1] = useState('#007AFF')
  const [gradientColor2, setGradientColor2] = useState('#5856D6')
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [qrSize, setQrSize] = useState(800)
  
  // Logo/Icon state
  const [logo, setLogo] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.35)
  const [logoMargin, setLogoMargin] = useState(5)
  const [logoInfo, setLogoInfo] = useState<CompressedLogo | null>(null)
  const [showIconOption, setShowIconOption] = useState(false)
  const [usePlatformIcon, setUsePlatformIcon] = useState(false)
  const [iconColor, setIconColor] = useState('#000000')
  
  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('core')
  const [showPayment, setShowPayment] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  
  // Crypto state
  const [cryptoSearch, setCryptoSearch] = useState('')
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false)
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion',
    message: ''
  })
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Preview size based on screen width
  const [previewSize, setPreviewSize] = useState(240)
  
  useEffect(() => {
    const updateSize = () => {
      setPreviewSize(window.innerWidth < 1024 ? 120 : 240)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Filter QR types by category
  const filteredTypes = qrTypes.filter(t => t.category === activeCategory)

  // Generate QR code (fixed size for preview)
  const updateQR = useCallback(() => {
    if (!qrRef.current) return
    qrRef.current.innerHTML = ''
    
    // Use placeholder data for preview
    const data = generatePlaceholderData(qrType)
    
    // Determine which logo to use: custom upload, platform icon, or none
    const imageSource = logo || (usePlatformIcon ? getPlatformIcon(qrType, iconColor) : null) || undefined
    
    const options = {
      width: previewSize,
      height: previewSize,
      data,
      image: imageSource,
      dotsOptions: {
        color: fgColor,
        type: dotsStyle as any,
        ...(gradientEnabled && {
          gradient: {
            type: gradientType,
            rotation: 0,
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 }
            ]
          }
        })
      },
      backgroundOptions: {
        color: bgTransparent ? 'transparent' : bgColor,
      },
      cornersSquareOptions: {
        type: cornersStyle as any,
        color: fgColor,
      },
      cornersDotOptions: {
        type: cornersStyle as any,
        color: fgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: logoMargin,
        imageSize: logoSize,
      },
    }
    
    const newQr = new QRCodeStyling(options)
    newQr.append(qrRef.current)
    setQr(newQr)
  }, [qrType, dotsStyle, cornersStyle, fgColor, bgColor, bgTransparent, gradientEnabled, gradientColor1, gradientColor2, gradientType, logo, logoSize, logoMargin, usePlatformIcon, iconColor, previewSize])

  useEffect(() => {
    updateQR()
  }, [updateQR])

  // Handle logo upload with compression
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const compressed = await compressLogo(file, 150)
      setLogo(compressed.dataUrl)
      setLogoInfo(compressed)
      setShowIconOption(true)
    } catch (error) {
      console.error('Failed to compress logo:', error)
    }
  }

  // Generate real QR for download (with actual size and data)
  const generateDownloadQR = (): QRCodeStyling => {
    const data = generateQRData(qrType, formData as Record<string, string>)
    
    // Determine which logo to use: custom upload, platform icon, or none
    const imageSource = logo || (usePlatformIcon ? getPlatformIcon(qrType, iconColor) : null) || undefined
    
    return new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data,
      image: imageSource,
      dotsOptions: {
        color: fgColor,
        type: dotsStyle as any,
        ...(gradientEnabled && {
          gradient: {
            type: gradientType,
            rotation: 0,
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 }
            ]
          }
        })
      },
      backgroundOptions: {
        color: bgTransparent ? 'transparent' : bgColor,
      },
      cornersSquareOptions: {
        type: cornersStyle as any,
        color: fgColor,
      },
      cornersDotOptions: {
        type: cornersStyle as any,
        color: fgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: logoMargin,
        imageSize: logoSize,
      },
    })
  }

  // Handle download after payment
  const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    const downloadQR = generateDownloadQR()
    
    // For PNG/JPEG with logo, we need to ensure the image is loaded
    // Create a hidden container and append to DOM temporarily
    const hiddenContainer = document.createElement('div')
    hiddenContainer.style.position = 'absolute'
    hiddenContainer.style.left = '-9999px'
    hiddenContainer.style.top = '-9999px'
    hiddenContainer.style.width = `${qrSize}px`
    hiddenContainer.style.height = `${qrSize}px`
    document.body.appendChild(hiddenContainer)
    
    try {
      // Append QR to hidden container and wait for render
      await downloadQR.append(hiddenContainer)
      
      // Small delay to ensure logo is loaded if present
      if (logo) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Download
      await downloadQR.download({ name: 'qr-code', extension: format })
    } finally {
      // Clean up
      document.body.removeChild(hiddenContainer)
    }
  }

  // Check if running in Telegram
  const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp

  // Initialize Telegram WebApp and parse URL params
  useEffect(() => {
    if (isTelegram) {
      window.Telegram!.WebApp!.ready()
    }
    
    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search)
    
    // Check for payment success from redirect
    if (urlParams.get('payment') === 'success') {
      setPaymentSuccess(true)
      setShowPayment(true)
    }
    
    // Check for QR type in URL (e.g., ?type=whatsapp)
    const typeParam = urlParams.get('type') as QRType
    if (typeParam) {
      const typeInfo = qrTypes.find(t => t.id === typeParam)
      if (typeInfo) {
        setQrType(typeParam)
        setActiveCategory(typeInfo.category)
      }
    }
    
    // Clean up URL params (keep clean URL for sharing)
    if (urlParams.get('payment') || urlParams.get('type')) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [isTelegram])

  // Handle payment - Stripe Checkout or Telegram
  const handlePayment = async () => {
    setPaymentLoading(true)
    setPaymentError(null)
    
    // Build metadata with all QR details
    const metadata: Record<string, string> = {
      qr_type: qrType,
      qr_data: generateQRData(qrType, formData as Record<string, string>),
      dots_style: dotsStyle,
      corners_style: cornersStyle,
      fg_color: fgColor,
      bg_color: bgTransparent ? 'transparent' : bgColor,
      qr_size: qrSize.toString(),
      has_logo: (logo ? 'true' : 'false'),
      use_platform_icon: usePlatformIcon.toString(),
      icon_color: iconColor,
    }
    
    // Add form data to metadata
    Object.entries(formData).forEach(([key, value]) => {
      if (value) metadata[`form_${key}`] = value
    })
    
    try {
      if (isTelegram && window.Telegram?.WebApp?.openInvoice) {
        // Telegram Payments
        const telegramPaymentUrl = 'https://t.me/$QRStudioBot?start=qr_payment'
        window.Telegram.WebApp.openInvoice(telegramPaymentUrl, (status) => {
          if (status === 'paid') {
            setPaymentSuccess(true)
          } else if (status === 'cancelled') {
            // User cancelled
          } else if (status === 'failed') {
            setPaymentError('Payment failed. Please try again.')
          }
        })
      } else {
        // Stripe Checkout
        const response = await fetch(`${API_BASE}/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            successUrl: `${window.location.origin}?payment=success`,
            cancelUrl: `${window.location.origin}?payment=cancelled`,
            metadata,
          }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }
        
        const { url } = await response.json()
        
        if (url) {
          // Redirect to Stripe Checkout
          window.location.href = url
        } else {
          throw new Error('No checkout URL returned')
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setPaymentError(error.message || 'Payment failed. Please try again.')
    } finally {
      setPaymentLoading(false)
    }
  }

  // Apply preset
  const applyPreset = (preset: typeof presets[number]) => {
    setFgColor(preset.fg)
    setBgColor(preset.bg)
    setDotsStyle(preset.dots as DotStyle)
    setCornersStyle(preset.corners as CornerStyle)
    setBgTransparent(preset.bg === 'transparent')
  }

  // Handle contact form submission
  const submitContactForm = async () => {
    setContactFormStatus('submitting')
    
    try {
      const response = await fetch(`${API_BASE}/contact-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'socials@enchantiarealms.com',
          subject: `[QR Studio] ${contactFormData.type.charAt(0).toUpperCase() + contactFormData.type.slice(1)} from ${contactFormData.name}`,
          name: contactFormData.name,
          email: contactFormData.email,
          type: contactFormData.type,
          message: contactFormData.message,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      })
      
      if (response.ok) {
        setContactFormStatus('success')
        setTimeout(() => {
          setShowContactForm(false)
          setContactFormStatus('idle')
          setContactFormData({ name: '', email: '', type: 'suggestion', message: '' })
        }, 2000)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setContactFormStatus('error')
    }
  }

  // Handle form input
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Render form fields based on QR type
  const renderForm = () => {
    const typeInfo = getQRTypeInfo(qrType)
    const handle = formData.handle
    const updateHandle = (v: string) => updateField('handle', v)
    const updateUrl = (v: string) => updateField('url', v)
    
    switch (qrType) {
      case 'url':
      case 'website':
        return (
          <div className="form-group">
            <label>Website URL</label>
            <input type="url" value={formData.url} onChange={(e) => updateUrl(e.target.value)} placeholder={typeInfo.placeholder} />
          </div>
        )
      case 'text':
        return (
          <div className="form-group">
            <label>Your Text</label>
            <textarea value={formData.text} onChange={(e) => updateField('text', e.target.value)} placeholder="Enter any text..." rows={4} />
          </div>
        )
      case 'wifi':
        return (
          <>
            <div className="form-group">
              <label>Network Name (SSID)</label>
              <input type="text" value={formData.ssid} onChange={(e) => updateField('ssid', e.target.value)} placeholder="My WiFi" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="text" value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Password" />
            </div>
            <div className="form-group">
              <label>Security Type</label>
              <select value={formData.security} onChange={(e) => updateField('security', e.target.value)}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </>
        )
      case 'email':
        return (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Subject (optional)</label>
              <input type="text" value={formData.subject} onChange={(e) => updateField('subject', e.target.value)} placeholder="Email subject" />
            </div>
            <div className="form-group">
              <label>Message (optional)</label>
              <textarea value={formData.body} onChange={(e) => updateField('body', e.target.value)} placeholder="Email body" rows={3} />
            </div>
          </>
        )
      case 'phone':
        return (
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
        )
      case 'sms':
        return (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} placeholder="SMS message" rows={3} />
            </div>
          </>
        )
      case 'vcard':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} placeholder="CEO" />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input type="url" value={formData.website} onChange={(e) => updateField('website', e.target.value)} placeholder="https://example.com" />
            </div>
          </>
        )
      case 'event':
        return (
          <>
            <div className="form-group">
              <label>Event Title</label>
              <input type="text" value={formData.subject} onChange={(e) => updateField('subject', e.target.value)} placeholder="Meeting" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start</label>
                <input type="datetime-local" value={formData.start} onChange={(e) => updateField('start', e.target.value)} />
              </div>
              <div className="form-group">
                <label>End</label>
                <input type="datetime-local" value={formData.end} onChange={(e) => updateField('end', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Conference Room A" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Event details" rows={3} />
            </div>
          </>
        )
      case 'whatsapp':
        return (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Pre-filled Message</label>
              <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} placeholder="Hello!" rows={2} />
            </div>
          </>
        )
      case 'instagram':
      case 'facebook':
      case 'twitter':
      case 'linkedin':
      case 'tiktok':
      case 'snapchat':
      case 'telegram':
      case 'messenger':
      case 'discord':
      case 'threads':
      case 'pinterest':
      case 'reddit':
      case 'twitch':
      case 'github':
      case 'medium':
      case 'paypal':
      case 'venmo':
      case 'cashapp':
        return (
          <div className="form-group">
            <label>Username / Handle</label>
            <input type="text" value={formData.handle} onChange={(e) => updateHandle(e.target.value)} placeholder={typeInfo.placeholder} />
          </div>
        )
      case 'bitcoin':
      case 'ethereum':
      case 'solana':
      case 'xrp':
      case 'bnb':
      case 'ton':
      case 'crypto':
        const selectedCoin = POPULAR_COINS.find(c => c.id === (formData.cryptoCoin || 'bitcoin')) || POPULAR_COINS[0]
        const filteredCoins = POPULAR_COINS.filter(c => 
          c.name.toLowerCase().includes(cryptoSearch.toLowerCase()) ||
          c.symbol.toLowerCase().includes(cryptoSearch.toLowerCase())
        )
        return (
          <>
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Select Cryptocurrency</label>
              <div 
                className="crypto-selector-trigger"
                onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
              >
                <span className="crypto-selected">
                  <span className="crypto-symbol">{selectedCoin.symbol}</span>
                  <span className="crypto-name">{selectedCoin.name}</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {showCryptoDropdown && (
                <div className="crypto-dropdown">
                  <div className="crypto-search">
                    <input
                      type="text"
                      placeholder="Search coin (e.g. BTC, Ethereum)..."
                      value={cryptoSearch}
                      onChange={(e) => setCryptoSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="crypto-list">
                    {POPULAR_COINS.slice(0, 6).map(coin => (
                      <button
                        key={coin.id}
                        className={`crypto-option ${formData.cryptoCoin === coin.id ? 'active' : ''}`}
                        onClick={() => {
                          updateField('cryptoCoin', coin.id)
                          setShowCryptoDropdown(false)
                          setCryptoSearch('')
                        }}
                      >
                        <span className="crypto-option-symbol">{coin.symbol}</span>
                        <span className="crypto-option-name">{coin.name}</span>
                      </button>
                    ))}
                    {cryptoSearch && filteredCoins.length > 0 && (
                      <>
                        <div className="crypto-divider">Search Results</div>
                        {filteredCoins.map(coin => (
                          <button
                            key={coin.id}
                            className={`crypto-option ${formData.cryptoCoin === coin.id ? 'active' : ''}`}
                            onClick={() => {
                              updateField('cryptoCoin', coin.id)
                              setShowCryptoDropdown(false)
                              setCryptoSearch('')
                            }}
                          >
                            <span className="crypto-option-symbol">{coin.symbol}</span>
                            <span className="crypto-option-name">{coin.name}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>{selectedCoin.name} Address</label>
              <input 
                type="text" 
                value={formData.cryptoAddress} 
                onChange={(e) => updateField('cryptoAddress', e.target.value)} 
                placeholder={`Enter ${selectedCoin.symbol} address...`} 
              />
            </div>
            <div className="form-group">
              <label>Amount ({selectedCoin.symbol}) - optional</label>
              <input 
                type="number" 
                value={formData.cryptoAmount} 
                onChange={(e) => updateField('cryptoAmount', e.target.value)} 
                placeholder="0.01" 
                step="0.000001" 
              />
            </div>
          </>
        )
      case 'youtube':
      case 'spotify':
      case 'appstore':
      case 'googleplay':
      case 'amazon':
      case 'googlemaps':
      case 'applemaps':
        return (
          <div className="form-group">
            <label>URL</label>
            <input type="url" value={formData.url} onChange={(e) => updateUrl(e.target.value)} placeholder="https://..." />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor"/>
              <rect x="18" y="2" width="12" height="12" rx="2" fill="currentColor"/>
              <rect x="2" y="18" width="12" height="12" rx="2" fill="currentColor"/>
              <rect x="20" y="20" width="8" height="8" rx="1" fill="currentColor"/>
              <rect x="6" y="6" width="4" height="4" rx="1" fill="white"/>
              <rect x="22" y="6" width="4" height="4" rx="1" fill="white"/>
              <rect x="6" y="22" width="4" height="4" rx="1" fill="white"/>
            </svg>
            <span className="logo-text">QR Code Studio</span>
          </div>
          <p className="tagline">No subscription. No strings attached. Your QR works forever.</p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="main">
        {/* Fixed Preview Panel - Always visible */}
        <aside className="preview-panel">
          <div className="preview-card">
            <div ref={qrRef} className="qr-container" />
            <div className="preview-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Preview</span>
            </div>
          </div>
          
          <div className="preview-content">
            <div className="preview-info">
              <h3>Customize your QR</h3>
              <p>Adjust style options below. Pay to download.</p>
            </div>

            <button className="download-btn" onClick={() => setShowConfirmation(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download ${PRICE.toFixed(2)}
            </button>
          </div>
        </aside>

        {/* Scrollable Content Area */}
        <div className="content-scrollable">
          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="tab-label">{cat.label}</span>
                <span className="tab-desc">{cat.description}</span>
              </button>
            ))}
          </div>

          {/* QR Type Selector */}
          <div className="section">
            <div className="type-grid">
              {filteredTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    className={`type-btn ${qrType === type.id ? 'active' : ''}`}
                    onClick={() => setQrType(type.id)}
                  >
                    <Icon className="type-icon" size={20} />
                    <span className="type-label">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Data Form */}
          <div className="section">
            <h3>Details</h3>
            {renderForm()}
          </div>

          {/* Style Options */}
          <div className="section">
            <h3>Style</h3>
            
            {/* Presets */}
            <div className="option-group">
              <label>Presets</label>
              <div className="preset-grid">
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    className="preset-btn"
                    onClick={() => applyPreset(preset)}
                    title={preset.name}
                    style={{ 
                      background: preset.bg === 'transparent' 
                        ? 'repeating-conic-gradient(#e5e5e5 0 25%, #fff 0 50%) 50% / 8px 8px' 
                        : preset.bg,
                      border: preset.bg === '#1c1c1e' ? '1px solid #333' : '1px solid #e5e5e5'
                    }}
                  >
                    <div style={{ background: preset.fg, width: 20, height: 20, borderRadius: 4 }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Dot Pattern */}
            <div className="option-group">
              <label>Pattern</label>
              <div className="pattern-grid">
                {dotStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`pattern-btn ${dotsStyle === style.id ? 'active' : ''}`}
                    onClick={() => setDotsStyle(style.id as DotStyle)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner style */}
            <div className="option-group">
              <label>Corners</label>
              <div className="pattern-grid">
                {cornerStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`pattern-btn ${cornersStyle === style.id ? 'active' : ''}`}
                    onClick={() => setCornersStyle(style.id as CornerStyle)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="option-group">
              <label>Colors</label>
              <div className="color-row">
                <div className="color-picker-group">
                  <span>Foreground</span>
                  <div className="color-input-wrap">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                    <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="color-hex" />
                  </div>
                </div>
                <div className="color-picker-group">
                  <span>Background</span>
                  <div className="color-input-wrap">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={bgTransparent} />
                    <label className="transparent-check">
                      <input type="checkbox" checked={bgTransparent} onChange={(e) => setBgTransparent(e.target.checked)} />
                      <span>Transparent</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient */}
            <div className="option-group">
              <label className="toggle-label">
                <input type="checkbox" checked={gradientEnabled} onChange={(e) => setGradientEnabled(e.target.checked)} />
                <span>Gradient</span>
              </label>
              {gradientEnabled && (
                <div className="gradient-options">
                  <div className="color-row">
                    <div className="color-picker-group">
                      <span>Start</span>
                      <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} />
                    </div>
                    <div className="color-picker-group">
                      <span>End</span>
                      <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} />
                    </div>
                    <select value={gradientType} onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}>
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Center Icon / Logo */}
            <div className="option-group">
              <label>Center Icon / Logo</label>
              
              {/* Platform Icon Option */}
              {hasPlatformIcon(qrType) && !logo && (
                <div className="platform-icon-option">
                  <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      checked={usePlatformIcon} 
                      onChange={(e) => setUsePlatformIcon(e.target.checked)} 
                    />
                    <span>Use {getQRTypeInfo(qrType).label} icon</span>
                  </label>
                  
                  {usePlatformIcon && (
                    <div className="icon-color-row">
                      <div className="color-picker-group">
                        <span>Icon Color</span>
                        <div className="color-input-wrap">
                          <input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} />
                          <input type="text" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="color-hex" />
                        </div>
                      </div>
                      {brandColors[qrType] && (
                        <button 
                          className="brand-color-btn"
                          onClick={() => setIconColor(brandColors[qrType] as string)}
                          title={`Use ${getQRTypeInfo(qrType).label} brand color`}
                        >
                          <span style={{ background: brandColors[qrType], width: 20, height: 20, borderRadius: 4, display: 'inline-block' }}></span>
                          <span className="brand-label">Official</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {(logo || usePlatformIcon) && (
                <div className="logo-controls-inline">
                  <div className="logo-sliders">
                    <label>
                      <span>Size</span>
                      <input type="range" min="0.15" max="0.5" step="0.05" value={logoSize} onChange={(e) => setLogoSize(parseFloat(e.target.value))} />
                    </label>
                    <label>
                      <span>Margin</span>
                      <input type="range" min="0" max="15" step="1" value={logoMargin} onChange={(e) => setLogoMargin(parseInt(e.target.value))} />
                    </label>
                  </div>
                  {logo && (
                    <div className="logo-preview" style={{ marginTop: '0.5rem' }}>
                      <img src={logo} alt="Logo" style={{ maxWidth: '60px', maxHeight: '60px' }} />
                      <button className="remove-logo" onClick={() => { setLogo(null); setLogoInfo(null); }}>×</button>
                    </div>
                  )}
                </div>
              )}
              
              {!logo && !usePlatformIcon && (
                <label className="upload-btn">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Upload Custom Logo</span>
                </label>
              )}
              <p className="option-hint">
                {hasPlatformIcon(qrType) 
                  ? 'Enable the platform icon or upload your own logo' 
                  : 'Add your logo or brand icon in the center'}
              </p>
            </div>

            {/* Download Size */}
            <div className="option-group">
              <label>Download Size</label>
              <div className="size-grid">
                {DOWNLOAD_SIZES.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${qrSize === size ? 'active' : ''}`}
                    onClick={() => setQrSize(size)}
                  >
                    {size}px
                  </button>
                ))}
              </div>
              <p className="option-hint">Larger sizes for print, smaller for web</p>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowConfirmation(false)}>×</button>
            
            <div className="modal-header">
              <h2>Confirm Your QR Code</h2>
              <p>Please review your details before payment</p>
            </div>

            <div className="confirmation-content">
              {/* QR Type */}
              <div className="confirmation-section">
                <h4>QR Type</h4>
                <p className="confirmation-value">{getQRTypeInfo(qrType).label}</p>
              </div>

              {/* QR Data */}
              <div className="confirmation-section">
                <h4>QR Data</h4>
                <p className="confirmation-value confirmation-data">
                  {generateQRData(qrType, formData as Record<string, string>)}
                </p>
              </div>

              {/* Form Data Summary */}
              <div className="confirmation-section">
                <h4>Details</h4>
                <div className="confirmation-details">
                  {qrType === 'url' && formData.url && <span>URL: {formData.url}</span>}
                  {qrType === 'text' && formData.text && <span>Text: {formData.text.substring(0, 50)}{formData.text.length > 50 ? '...' : ''}</span>}
                  {qrType === 'wifi' && formData.ssid && <span>SSID: {formData.ssid}</span>}
                  {qrType === 'email' && formData.email && <span>Email: {formData.email}</span>}
                  {qrType === 'phone' && formData.phone && <span>Phone: {formData.phone}</span>}
                  {qrType === 'vcard' && formData.firstName && <span>Name: {formData.firstName} {formData.lastName}</span>}
                  {['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'telegram', 'github', 'paypal', 'venmo', 'cashapp'].includes(qrType) && formData.handle && <span>Handle: {formData.handle}</span>}
                  {qrType === 'bitcoin' && formData.address && <span>Address: {formData.address.substring(0, 20)}...</span>}
                </div>
              </div>

              {/* Style Options */}
              <div className="confirmation-section">
                <h4>Style</h4>
                <div className="confirmation-style">
                  <div className="style-item">
                    <span>Pattern:</span>
                    <span>{dotStyles.find(s => s.id === dotsStyle)?.name}</span>
                  </div>
                  <div className="style-item">
                    <span>Corners:</span>
                    <span>{cornerStyles.find(s => s.id === cornersStyle)?.name}</span>
                  </div>
                  <div className="style-item">
                    <span>Colors:</span>
                    <div className="color-swatch">
                      <span style={{ background: fgColor }} className="swatch"></span>
                      <span style={{ background: bgTransparent ? 'repeating-conic-gradient(#e5e5e5 0 25%, #fff 0 50%) 50% / 8px 8px' : bgColor }} className="swatch"></span>
                    </div>
                  </div>
                  {usePlatformIcon && (
                    <div className="style-item">
                      <span>Icon:</span>
                      <span style={{ color: iconColor }}>{getQRTypeInfo(qrType).label} icon</span>
                    </div>
                  )}
                  {logo && (
                    <div className="style-item">
                      <span>Logo:</span>
                      <span>Custom logo</span>
                    </div>
                  )}
                  <div className="style-item">
                    <span>Size:</span>
                    <span>{qrSize}px</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="confirmation-price">
                <span className="price-label">Total</span>
                <span className="price-value">${PRICE.toFixed(2)}</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="btn-secondary" onClick={() => setShowConfirmation(false)}>
                Go Back
              </button>
              <button className="pay-btn" onClick={() => { setShowConfirmation(false); handlePayment(); }}>
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal-overlay" onClick={() => {
          if (paymentSuccess) {
            setShowPayment(false)
            setPaymentSuccess(false)
          }
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => {
              setShowPayment(false)
              setPaymentSuccess(false)
            }}>×</button>
            
            {paymentSuccess ? (
              <>
                <div className="modal-header success">
                  <div className="success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h2>Your QR code is ready!</h2>
                  <p>Download in your preferred format</p>
                </div>

                <div className="download-options">
                  <button className="download-option" onClick={() => handleDownload('png')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="format">PNG</span>
                    <span className="format-desc">High quality • {qrSize}×{qrSize}px</span>
                  </button>
                  
                  <button className="download-option" onClick={() => handleDownload('svg')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                    <span className="format">SVG</span>
                    <span className="format-desc">Vector • Scalable</span>
                  </button>
                  
                  <button className="download-option" onClick={() => handleDownload('jpeg')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="format">JPEG</span>
                    <span className="format-desc">Web ready • {qrSize}×{qrSize}px</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Unlock Your QR Code</h2>
                  <p>One-time payment. Your QR works forever.</p>
                </div>

                <div className="modal-pricing">
                  <div className="price-option selected">
                    <span className="price">${PRICE.toFixed(2)}</span>
                    <span className="price-label">Single QR Code</span>
                    <ul className="price-features">
                      <li>PNG, SVG, JPEG formats</li>
                      <li>Up to {Math.max(...DOWNLOAD_SIZES)}px download</li>
                      <li>No watermark</li>
                      <li>Works forever</li>
                    </ul>
                  </div>
                </div>

                {paymentError && (
                  <div className="payment-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {paymentError}
                  </div>
                )}

                <div className="modal-form">
                  <button className="pay-btn" onClick={handlePayment} disabled={paymentLoading}>
                    {paymentLoading ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                          <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        Pay ${PRICE.toFixed(2)}
                      </>
                    )}
                  </button>

                  <p className="secure-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    {isTelegram ? 'Secured by Telegram Payments' : 'Secured by Stripe Checkout'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="modal-overlay" onClick={() => setShowContactForm(false)}>
          <div className="modal contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContactForm(false)}>×</button>
            
            <div className="modal-header">
              <h2>Contact Us</h2>
              <p>Have a suggestion, need support, or want to request a feature?</p>
            </div>

            {contactFormStatus === 'success' ? (
              <div className="contact-success">
                <div className="success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <div className="contact-form">
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={contactFormData.type} 
                    onChange={(e) => setContactFormData({...contactFormData, type: e.target.value})}
                  >
                    <option value="suggestion">💡 Suggestion</option>
                    <option value="support">🆘 Support Request</option>
                    <option value="feature">✨ Feature Request</option>
                    <option value="bug">🐛 Bug Report</option>
                    <option value="other">📝 Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Email</label>
                  <input 
                    type="email" 
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData({...contactFormData, message: e.target.value})}
                    placeholder="Tell us what's on your mind..."
                    rows={4}
                    required
                  />
                </div>

                {contactFormStatus === 'error' && (
                  <div className="contact-error">
                    Failed to send message. Please try again or email us directly at socials@enchantiarealms.com
                  </div>
                )}

                <button 
                  className="pay-btn" 
                  onClick={submitContactForm}
                  disabled={contactFormStatus === 'submitting' || !contactFormData.name || !contactFormData.email || !contactFormData.message}
                >
                  {contactFormStatus === 'submitting' ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>
          © 2026 QR Code Studio • Beautiful QR codes, instantly. No subscription required.
          {' '}<button className="footer-link" onClick={() => setShowContactForm(true)}>Contact & Support</button>
        </p>
      </footer>
    </div>
  )
}

export default App