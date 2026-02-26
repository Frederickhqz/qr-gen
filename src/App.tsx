import { useState, useRef, useEffect, useCallback } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { qrTypes, categories, getQRTypeInfo, type QRType } from './utils/icons'
import { generateQRData, generatePlaceholderData } from './utils/qrData'
import { compressLogo, type CompressedLogo } from './utils/logoCompress'
import { dotStyles, cornerStyles, presets, type DotStyle, type CornerStyle } from './utils/styling'
import { getPlatformIcon, hasPlatformIcon, brandColors } from './utils/platformIcons'
import { AuthModal } from './components/AuthModal'
import { UserMenu } from './components/UserMenu'
import { QRHistoryModal } from './components/QRHistory'
import { supabase } from './lib/supabase'
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

const PRICE = 1.99
const API_BASE = 'https://n8n.srv796810.hstgr.cloud'

// Popular cryptocurrencies for the dropdown
const popularCryptos = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'XRP' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'TON', name: 'Toncoin' },
]

const allCryptos = [
  ...popularCryptos,
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'TRX', name: 'TRON' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'SHIB', name: 'Shiba Inu' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'XLM', name: 'Stellar' },
  { symbol: 'ALGO', name: 'Algorand' },
  { symbol: 'VET', name: 'VeChain' },
]

function App() {
  const qrRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Core state
  const [qrType, setQrType] = useState<QRType>('url')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [qr, setQr] = useState<QRCodeStyling | null>(null)
  
  // Styling state
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
  
  // Logo state
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

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'save' | 'login'>('save')
  const [pendingDownloadQR, setPendingDownloadQR] = useState<{ type: string; data: Record<string, string>; styles: any } | null>(null)
  const [pendingDownloadFormat, setPendingDownloadFormat] = useState<'png' | 'svg' | 'jpeg'>('png')
  const [user, setUser] = useState<any>(null)
  
  // History modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false)

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

  // Check for user session on mount and auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
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

  // Actually perform the download
  const performDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    const downloadQR = generateDownloadQR()
    
    const hiddenContainer = document.createElement('div')
    hiddenContainer.style.position = 'absolute'
    hiddenContainer.style.left = '-9999px'
    hiddenContainer.style.top = '-9999px'
    hiddenContainer.style.width = `${qrSize}px`
    hiddenContainer.style.height = `${qrSize}px`
    document.body.appendChild(hiddenContainer)
    
    try {
      await downloadQR.append(hiddenContainer)
      
      if (logo) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      await downloadQR.download({ name: 'qr-code', extension: format })
    } finally {
      document.body.removeChild(hiddenContainer)
    }
  }

  // Handle download - shows auth modal first for non-logged-in users
  const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    // Store QR data for saving
    const qrDataToSave = {
      type: qrType,
      data: { ...formData },
      styles: {
        fgColor,
        bgColor,
        dotsStyle,
        cornersStyle,
        gradientEnabled,
        gradientColor1,
        gradientColor2,
        gradientType,
        logo: logo || undefined,
        logoSize,
        logoMargin,
        usePlatformIcon,
        iconColor
      }
    }
    
    // If logged in, save and download immediately
    if (user) {
      await performDownload(format)
      
      // Save to Supabase
      await supabase.from('qr_codes').insert({
        user_id: user.id,
        type: qrType,
        data: qrDataToSave.data,
        styles: qrDataToSave.styles
      })
      
      // Track event
      await supabase.from('events').insert({
        user_id: user.id,
        event_type: 'qr_downloaded',
        event_data: { format, qr_type: qrType }
      })
      return
    }
    
    // Not logged in - show auth modal first
    setPendingDownloadQR(qrDataToSave)
    setPendingDownloadFormat(format)
    setShowAuthModal(true)
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

    // Check for crypto type in URL (e.g., ?type=crypto&coin=BTC)
    if (typeParam === 'crypto') {
      const coinParam = urlParams.get('coin')
      if (coinParam) {
        setFormData(prev => ({ ...prev, coin: coinParam }))
      }
    }
  }, [])

  // Handle form input
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Render form fields based on QR type
  const renderForm = () => {
    const typeInfo = getQRTypeInfo(qrType)
    const handle = formData.handle
    const updateHandle = (v: string) => updateField('handle', v)
    const updateUrl = (v: string) => updateField('url', v)
    
    return (
      <div className="form-fields">
        <div className="form-group">
          <label>{typeInfo.label}</label>
          <input
            type="text"
            value={formData[typeInfo.fields[0]] || ''}
            onChange={(e) => updateField(typeInfo.fields[0], e.target.value)}
            placeholder={typeInfo.placeholder}
          />
        </div>
      </div>
    )
  }

  // Loading state
  if (!qr) {
    return <div className="loading">Loading...</div>
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
          
          <div className="header-right">
            <p className="tagline">No subscription. No strings attached.</p>
            
            {user ? (
              <UserMenu 
                user={user}
                onShowHistory={() => setShowHistoryModal(true)}
                onSignOut={() => setUser(null)}
              />
            ) : (
              <button 
                className="header-signin-btn"
                onClick={() => {
                  setAuthModalMode('login')
                  setShowAuthModal(true)
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout - Desktop: Fixed header/preview, scrollable content */}
      <main className="main">
        {/* Fixed Left Panel - Preview */}
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
              <p className="preview-subtitle">Adjust style options below. Pay to download.</p>
            </div>

            <p className="preview-tagline">No subscription. No strings attached. Your QR works forever.</p>

            <button className="download-btn btn-primary" onClick={() => setShowConfirmation(true)}>
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
        <div className="content-wrapper">
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
                      className={`type-card ${qrType === type.id ? 'active' : ''}`}
                      onClick={() => setQrType(type.id as QRType)}
                    >
                      <div className="type-icon-wrapper">
                        <Icon className="type-icon" />
                      </div>
                      <span className="type-label">{type.label}</span>
                      <span className="type-desc">{type.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Footer inside content wrapper */}
          <footer className="content-footer">
            <p>
              © 2026 QR Code Studio • Beautiful QR codes, instantly. No subscription required.
              {' '}<a className="footer-link" href="mailto:socials@enchantiarealms.com?subject=QR%20Studio%20Support">Contact & Support</a>
              {' | '}
              <button className="footer-link" onClick={() => {
                if (user) {
                  setShowHistoryModal(true)
                } else {
                  setAuthModalMode('login')
                  setShowAuthModal(true)
                }
              }}>My QR Codes</button>
            </p>
          </footer>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowConfirmation(false)}>×</button>
            
            <div className="confirmation-header">
              <h3>Ready to download?</h3>
              <p>You'll get your QR code in high quality</p>
            </div>

            <div className="confirmation-qr">
              <div ref={(el) => {
                if (el) {
                  el.innerHTML = ''
                  const qr = generateDownloadQR()
                  qr.append(el)
                }
              }} />
            </div>

            <div className="confirmation-details">
              <div className="detail-row">
                <span>Type</span>
                <strong>{qrTypes.find(t => t.id === qrType)?.label}</strong>
              </div>
              <div className="detail-row">
                <span>Size</span>
                <strong>{qrSize}×{qrSize}px</strong>
              </div>
            </div>

            <div className="confirmation-price">
              <span className="price">${PRICE.toFixed(2)}</span>
              <span className="price-note">One-time purchase</span>
            </div>

            <button 
              className="pay-btn btn-primary"
              onClick={() => {
                setShowConfirmation(false)
                handleDownload('png')
              }}
            >
              Continue to Payment
            </button>

            <button className="secondary-btn" onClick={() => setShowConfirmation(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          qrData={pendingDownloadQR || undefined}
          mode={authModalMode}
          onClose={() => {
            setShowAuthModal(false)
            setPendingDownloadQR(null)
          }}
          onSuccess={() => {
            setShowAuthModal(false)
            setPendingDownloadQR(null)
            // Refresh user session
            supabase.auth.getSession().then(({ data: { session } }) => {
              setUser(session?.user || null)
            })
          }}
          onDownload={pendingDownloadQR ? () => performDownload(pendingDownloadFormat) : undefined}
        />
      )}

      {showHistoryModal && user && (
        <QRHistoryModal
          user={user}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  )
}

export default App
