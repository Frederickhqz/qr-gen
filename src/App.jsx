import { useState, useRef, useEffect } from 'react'
import QRCodeStyling from 'qr-code-styling'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('url')
  const [qrCode, setQrCode] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const [hasLogo, setHasLogo] = useState(false)
  const qrRef = useRef(null)

  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState('WPA')
  const [emailInput, setEmailInput] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [phoneInput, setPhoneInput] = useState('')

  const [colorFg, setColorFg] = useState('#000000')
  const [colorBg, setColorBg] = useState('#ffffff')
  const [qrStyle, setQrStyle] = useState('square')
  const [cornerStyle, setCornerStyle] = useState('square')
  const [logoSize, setLogoSize] = useState(0.4)
  const [logoMargin, setLogoMargin] = useState(10)

  // Auto-generate on load
  useEffect(() => {
    generateQR()
  }, [])

  const getQRData = () => {
    switch(currentTab) {
      case 'url':
        return urlInput || ''
      case 'text':
        return textInput || ''
      case 'wifi':
        if (!wifiSsid) return ''
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`
      case 'email':
        if (!emailInput) return ''
        let mailto = `mailto:${emailInput}`
        const params = []
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`)
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`)
        if (params.length) mailto += '?' + params.join('&')
        return mailto
      case 'phone':
        return phoneInput ? `tel:${phoneInput}` : ''
      default:
        return ''
    }
  }

  const generateQR = () => {
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
    }
    
    const data = getQRData()
    if (!data) {
      // Show placeholder if no data
      return
    }
    
    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      data: data,
      image: logoUrl,
      dotsOptions: {
        color: colorFg,
        type: qrStyle
      },
      backgroundOptions: {
        color: colorBg,
      },
      cornersSquareOptions: {
        type: cornerStyle,
        color: colorFg
      },
      cornersDotOptions: {
        type: cornerStyle,
        color: colorFg
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: logoMargin,
        imageSize: logoSize
      }
    })

    qr.append(qrRef.current)
    setQrCode(qr)
  }

  // Auto-generate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (getQRData()) {
        generateQR()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [urlInput, textInput, wifiSsid, wifiPassword, wifiType, emailInput, emailSubject, emailBody, phoneInput, colorFg, colorBg, qrStyle, cornerStyle, logoUrl, logoSize, logoMargin])

  const downloadQR = (format) => {
    if (qrCode) {
      qrCode.download({ name: "qr-code", extension: format })
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        // Auto-adjust size for larger images
        const img = new Image()
        img.onload = () => {
          // If image is large, reduce size
          if (img.width > 500 || img.height > 500) {
            setLogoSize(0.25)
          } else if (img.width > 200 || img.height > 200) {
            setLogoSize(0.35)
          }
          setLogoUrl(e.target.result)
          setHasLogo(true)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const clearLogo = () => {
    setLogoUrl(null)
    setHasLogo(false)
    setLogoSize(0.4)
  }

  const setTab = (tab) => {
    setCurrentTab(tab)
  }

  const presets = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff', style: 'square', corner: 'square' },
    { name: 'Dark', fg: '#ffffff', bg: '#000000', style: 'square', corner: 'square' },
    { name: 'Ocean', fg: '#0ea5e9', bg: '#0f172a', style: 'dot', corner: 'dot' },
    { name: 'Forest', fg: '#22c55e', bg: '#052e16', style: 'rounded', corner: 'extra-rounded' },
    { name: 'Sunset', fg: '#f97316', bg: '#431407', style: 'classy', corner: 'extra-rounded' },
    { name: 'Purple', fg: '#a855f7', bg: '#1e1b4b', style: 'classy-rounded', corner: 'extra-rounded' },
  ]

  const applyPreset = (preset) => {
    setColorFg(preset.fg)
    setColorBg(preset.bg)
    setQrStyle(preset.style)
    setCornerStyle(preset.corner)
  }

  return (
    <div className="app">
      <header>
        <div className="logo-mark">⬡</div>
        <h1>QR Studio</h1>
        <p>Professional QR codes with style</p>
      </header>

      <div className="container">
        {/* Input Section */}
        <div className="card input-section">
          <div className="tabs">
            <button className={currentTab === 'url' ? 'active' : ''} onClick={() => setTab('url')}>URL</button>
            <button className={currentTab === 'text' ? 'active' : ''} onClick={() => setTab('text')}>Text</button>
            <button className={currentTab === 'wifi' ? 'active' : ''} onClick={() => setTab('wifi')}>WiFi</button>
            <button className={currentTab === 'email' ? 'active' : ''} onClick={() => setTab('email')}>Email</button>
            <button className={currentTab === 'phone' ? 'active' : ''} onClick={() => setTab('phone')}>Phone</button>
          </div>

          <div className="input-content">
            {currentTab === 'url' && (
              <div className="input-group">
                <input 
                  type="url" 
                  value={urlInput} 
                  onChange={(e) => setUrlInput(e.target.value)} 
                  placeholder="https://yourwebsite.com"
                  className="main-input"
                />
              </div>
            )}

            {currentTab === 'text' && (
              <div className="input-group">
                <textarea 
                  value={textInput} 
                  onChange={(e) => setTextInput(e.target.value)} 
                  placeholder="Your text or message..."
                  className="main-input"
                />
              </div>
            )}

            {currentTab === 'wifi' && (
              <div className="input-group">
                <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="Network Name (SSID)" />
                <input type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" />
                <select value={wifiType} onChange={(e) => setWifiType(e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Encryption</option>
                </select>
              </div>
            )}

            {currentTab === 'email' && (
              <div className="input-group">
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Email Address" />
                <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Subject (optional)" />
                <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Message (optional)" />
              </div>
            )}

            {currentTab === 'phone' && (
              <div className="input-group">
                <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="+1 (555) 123-4567" className="main-input" />
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="presets">
            <label>Quick Styles</label>
            <div className="preset-grid">
              {presets.map((preset) => (
                <button 
                  key={preset.name}
                  className="preset-btn"
                  style={{ background: preset.bg }}
                  onClick={() => applyPreset(preset)}
                  title={preset.name}
                >
                  <div style={{ background: preset.fg, width: 20, height: 20, borderRadius: 4 }}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Styling */}
          <div className="styling">
            <div className="style-row">
              <div className="style-item">
                <label>Color</label>
                <div className="color-row">
                  <input type="color" value={colorFg} onChange={(e) => setColorFg(e.target.value)} />
                  <span>{colorFg}</span>
                </div>
              </div>
              <div className="style-item">
                <label>Background</label>
                <div className="color-row">
                  <input type="color" value={colorBg} onChange={(e) => setColorBg(e.target.value)} />
                  <span>{colorBg}</span>
                </div>
              </div>
            </div>

            <div className="style-row">
              <div className="style-item">
                <label>Pattern</label>
                <select value={qrStyle} onChange={(e) => setQrStyle(e.target.value)}>
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                  <option value="rounded">Rounded</option>
                  <option value="extra-rounded">Extra Rounded</option>
                  <option value="classy">Classy</option>
                  <option value="classy-rounded">Classy Rounded</option>
                </select>
              </div>
              <div className="style-item">
                <label>Corners</label>
                <select value={cornerStyle} onChange={(e) => setCornerStyle(e.target.value)}>
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                  <option value="extra-rounded">Extra Rounded</option>
                </select>
              </div>
            </div>

            {/* Logo Section */}
            <div className="logo-section">
              <label>Logo (center)</label>
              {!hasLogo ? (
                <div className="logo-upload">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} id="logo-file" />
                  <label htmlFor="logo-file" className="upload-btn">+ Add Logo</label>
                  <small>Auto-sizes for best results</small>
                </div>
              ) : (
                <div className="logo-adjust">
                  <div className="logo-preview">
                    <img src={logoUrl} alt="Logo" />
                    <button className="remove-logo" onClick={clearLogo}>×</button>
                  </div>
                  <div className="logo-slider">
                    <span>Size</span>
                    <input 
                      type="range" 
                      min="0.15" 
                      max="0.5" 
                      step="0.05" 
                      value={logoSize} 
                      onChange={(e) => setLogoSize(parseFloat(e.target.value))} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="card preview-section">
          <div className="preview-header">
            <span>Preview</span>
            {qrCode && <button className="clear-btn" onClick={() => { setUrlInput(''); setTextInput(''); qrRef.current.innerHTML = '<div class=\'placeholder\'>Enter content above</div>' }}>Clear</button>}
          </div>
          
          <div className="preview-frame">
            <div className="preview" ref={qrRef}>
              <div className="placeholder">Enter content above</div>
            </div>
          </div>
          
          {qrCode && (
            <div className="download-btns">
              <button onClick={() => downloadQR('png')}>
                <span className="icon">⬇</span>
                PNG
              </button>
              <button onClick={() => downloadQR('svg')}>
                <span className="icon">⬇</span>
                SVG
              </button>
            </div>
          )}

          {hasLogo && (
            <div className="promo-card">
              <p>Remove watermark</p>
              <a href="https://buy.stripe.com/9B6bJ11xH48nd2h4OZ3Nm02" target="_blank" rel="noopener noreferrer" className="promo-btn">
                Get Pro - $2
              </a>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="plans">
            <div className="plan-header">
              <span className="plan-icon">📊</span>
              <span>Short URLs + Analytics</span>
            </div>
            <a href="https://buy.stripe.com/7sYeVd7W548n8M195f3Nm03" target="_blank" rel="noopener noreferrer" className="plan">
              <span>5 URLs</span>
              <span className="price">$5/mo</span>
            </a>
            <a href="https://buy.stripe.com/6oU3cv3FP9sHe6l5T33Nm04" target="_blank" rel="noopener noreferrer" className="plan">
              <span>20 URLs</span>
              <span className="price">$15/mo</span>
            </a>
            <a href="https://buy.stripe.com/eVqbJ1ektcETbYd95f3Nm05" target="_blank" rel="noopener noreferrer" className="plan">
              <span>100 URLs</span>
              <span className="price">$50/mo</span>
            </a>
          </div>
        </div>
      </div>

      <footer>
        <span>QR Studio</span>
      </footer>
    </div>
  )
}

export default App
