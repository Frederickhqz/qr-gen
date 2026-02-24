import { useState, useRef, useEffect, useCallback } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { qrTypes, categories, getQRTypeInfo, type QRType } from './utils/icons'
import { generateQRData, generatePlaceholderData } from './utils/qrData'
import { compressLogo, type CompressedLogo } from './utils/logoCompress'
import { dotStyles, cornerStyles, presets, type DotStyle, type CornerStyle } from './utils/styling'
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
  }
}

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
}

const initialFormData: FormData = {
  url: '', text: '', ssid: '', password: '', security: 'WPA',
  email: '', subject: '', body: '', phone: '', message: '',
  firstName: '', lastName: '', company: '', title: '', website: '',
  start: '', end: '', location: '', description: '',
  handle: '', address: '', amount: ''
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
  
  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('core')
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Constants
  const PREVIEW_SIZE = 240

  // Filter QR types by category
  const filteredTypes = qrTypes.filter(t => t.category === activeCategory)

  // Generate QR code (fixed size for preview)
  const updateQR = useCallback(() => {
    if (!qrRef.current) return
    qrRef.current.innerHTML = ''
    
    // Use placeholder data for preview
    const data = generatePlaceholderData(qrType)
    
    const options = {
      width: PREVIEW_SIZE,
      height: PREVIEW_SIZE,
      data,
      image: logo || undefined,
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
  }, [qrType, dotsStyle, cornersStyle, fgColor, bgColor, bgTransparent, gradientEnabled, gradientColor1, gradientColor2, gradientType, logo, logoSize, logoMargin])

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
    
    return new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data,
      image: logo || undefined,
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
  const handleDownload = (format: 'png' | 'svg' | 'jpeg') => {
    const downloadQR = generateDownloadQR()
    downloadQR.download({ name: 'qr-code', extension: format })
  }

  // Check if running in Telegram
  const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp

  // Initialize Telegram WebApp
  useEffect(() => {
    if (isTelegram) {
      window.Telegram!.WebApp!.ready()
    }
  }, [isTelegram])

  // Handle payment - Telegram or mock
  const handlePayment = () => {
    if (isTelegram && window.Telegram?.WebApp?.openInvoice) {
      const telegramPaymentUrl = 'https://t.me/$QRStudioBot?start=qr_payment'
      
      window.Telegram.WebApp.openInvoice(telegramPaymentUrl, (status) => {
        if (status === 'paid') {
          setPaymentSuccess(true)
        } else if (status === 'cancelled') {
          // User cancelled
        } else if (status === 'failed') {
          console.error('Payment failed')
        }
      })
    } else {
      // Mock payment for non-Telegram
      setPaymentSuccess(true)
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
        return (
          <>
            <div className="form-group">
              <label>Bitcoin Address</label>
              <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} placeholder="bc1q..." />
            </div>
            <div className="form-group">
              <label>Amount (BTC) - optional</label>
              <input type="number" value={formData.amount} onChange={(e) => updateField('amount', e.target.value)} placeholder="0.01" step="0.0001" />
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
          
          <div className="preview-info">
            <h3>Customize your QR</h3>
            <p>Adjust style options below. Pay to download.</p>
          </div>

          <button className="download-btn" onClick={() => setShowPayment(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download ${PRICE.toFixed(2)}
          </button>
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
              {logo ? (
                <div className="logo-preview-wrap">
                  <div className="logo-preview">
                    <img src={logo} alt="Logo" />
                    <button className="remove-logo" onClick={() => { setLogo(null); setLogoInfo(null); setShowIconOption(false); }}>×</button>
                  </div>
                  <div className="logo-controls">
                    {logoInfo?.wasCompressed && (
                      <p className="logo-info">
                        Resized from {logoInfo.originalWidth}×{logoInfo.originalHeight} to {logoInfo.newWidth}×{logoInfo.newHeight}
                      </p>
                    )}
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
                  </div>
                </div>
              ) : (
                <label className="upload-btn">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Add Icon / Logo</span>
                </label>
              )}
              <p className="option-hint">Add your logo or brand icon in the center for better identification</p>
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

                <div className="modal-form">
                  <div className="form-group">
                    <label>Email (for receipt)</label>
                    <input type="email" placeholder="you@example.com" />
                  </div>
                  
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="4242 4242 4242 4242" />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVC</label>
                      <input type="text" placeholder="123" />
                    </div>
                  </div>

                  <button className="pay-btn" onClick={handlePayment}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Pay ${PRICE.toFixed(2)}
                  </button>

                  <p className="secure-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    {isTelegram ? 'Secured by Telegram Payments' : 'Secured by Stripe'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>© 2026 QR Code Studio • Beautiful QR codes, instantly. No subscription required.</p>
      </footer>
    </div>
  )
}

export default App