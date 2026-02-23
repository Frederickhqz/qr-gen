import { useState, useRef, useEffect } from 'react'
import QRCodeStyling from 'qr-code-styling'
import './App.css'

// Pattern icons - SVG shapes
const PatternIcons = {
  square: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  dot: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="2.5"/><circle cx="12" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/></svg>,
  rounded: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="10"/></svg>,
  'extra-rounded': <svg viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="1" width="22" height="22" rx="11"/></svg>,
  classy: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="7" height="7" rx="2"/><rect x="15" y="2" width="7" height="7" rx="2"/><rect x="2" y="15" width="7" height="7" rx="2"/><rect x="15" y="15" width="7" height="7" rx="2"/><circle cx="12" cy="12" r="4"/></svg>,
  'classy-rounded': <svg viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="1" width="8" height="8" rx="4"/><rect x="15" y="1" width="8" height="8" rx="4"/><rect x="1" y="15" width="8" height="8" rx="4"/><rect x="15" y="15" width="8" height="8" rx="4"/><circle cx="12" cy="12" r="5"/></svg>
}

const CornerIcons = {
  square: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z"/></svg>,
  dot: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  'extra-rounded': <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="8" height="8" rx="4"/><rect x="14" y="2" width="8" height="8" rx="4"/><rect x="2" y="14" width="8" height="8" rx="4"/><rect x="14" y="14" width="8" height="8" rx="4"/></svg>
}

function App() {
  const [currentTab, setCurrentTab] = useState('url')
  const [qrCode, setQrCode] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const [hasLogo, setHasLogo] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
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
  const [bgTransparent, setBgTransparent] = useState(false)
  const [colorCornerSquare, setColorCornerSquare] = useState('#000000')
  const [colorCornerDot, setColorCornerDot] = useState('#000000')
  
  const [qrStyle, setQrStyle] = useState('square')
  const [cornerStyle, setCornerStyle] = useState('square')
  const [logoSize, setLogoSize] = useState(0.4)
  const [logoMargin, setLogoMargin] = useState(10)
  const [padding, setPadding] = useState(20)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('paid') === 'true') setIsPaid(true)
  }, [])

  const getQRData = () => {
    switch(currentTab) {
      case 'url': return urlInput.trim() || ''
      case 'text': return textInput.trim() || ''
      case 'wifi': return wifiSsid.trim() ? `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;` : ''
      case 'email': 
        if (!emailInput.trim()) return ''
        let mailto = `mailto:${emailInput}`
        const params = []
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`)
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`)
        return params.length ? mailto + '?' + params.join('&') : mailto
      case 'phone': return phoneInput.trim() ? `tel:${phoneInput.trim()}` : ''
      default: return ''
    }
  }

  const hasContent = () => !!getQRData()

  const generateQR = () => {
    if (qrRef.current) qrRef.current.innerHTML = ''
    const data = getQRData()
    
    if (!data || (!isPaid && hasContent())) {
      const placeholderData = isPaid ? (getQRData() || 'https://qrgen.studio') : 'https://qrgen.studio'
      const qr = new QRCodeStyling({
        width: 280 + padding * 2, height: 280 + padding * 2,
        data: placeholderData,
        image: logoUrl,
        dotsOptions: { color: colorFg, type: qrStyle },
        backgroundOptions: { color: bgTransparent ? '#f8f9fa' : colorBg },
        cornersSquareOptions: { type: cornerStyle, color: colorCornerSquare },
        cornersDotOptions: { type: cornerStyle, color: colorCornerDot },
        imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize },
        qrOptions: { margin: padding }
      })
      qr.append(qrRef.current)
      setQrCode(qr)
      return
    }

    const qr = new QRCodeStyling({
      width: 280 + padding * 2, height: 280 + padding * 2,
      data, image: logoUrl,
      dotsOptions: { color: colorFg, type: qrStyle },
      backgroundOptions: { color: bgTransparent ? 'transparent' : colorBg },
      cornersSquareOptions: { type: cornerStyle, color: colorCornerSquare },
      cornersDotOptions: { type: cornerStyle, color: colorCornerDot },
      imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize },
      qrOptions: { margin: padding }
    })
    qr.append(qrRef.current)
    setQrCode(qr)
  }

  useEffect(() => { generateQR() }, [])
  useEffect(() => { const t = setTimeout(generateQR, 300); return () => clearTimeout(t) }, 
    [urlInput, textInput, wifiSsid, wifiPassword, wifiType, emailInput, emailSubject, emailBody, phoneInput, 
     colorFg, colorBg, bgTransparent, qrStyle, cornerStyle, logoUrl, logoSize, logoMargin, padding, 
     colorCornerSquare, colorCornerDot, isPaid])

  const downloadQR = (format) => {
    if (qrCode && hasContent() && isPaid) {
      qrCode.download({ name: 'qr-code', extension: format, backgroundOptions: { color: bgTransparent ? undefined : colorBg } })
    }
  }

  const compressImage = (file, maxSizeMB = 1, maxWidth = 400) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let w = img.width, h = img.height
          if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth }
          canvas.width = w; canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)
          const compress = (q) => {
            const d = canvas.toDataURL('image/png', q)
            if ((d.length * 3) / 4 / 1024 / 1024 <= maxSizeMB || q <= 0.3) resolve(d)
            else compress(q - 0.1)
          }
          compress(0.9)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      try {
        const compressed = await compressImage(file, 1, 400)
        setLogoUrl(compressed); setHasLogo(true); setLogoSize(0.35)
      } catch { alert('Could not compress. Try smaller file.') }
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          if (img.width > 500 || img.height > 500) setLogoSize(0.25)
          else if (img.width > 200 || img.height > 200) setLogoSize(0.35)
          setLogoUrl(e.target.result); setHasLogo(true)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const clearLogo = () => { setLogoUrl(null); setHasLogo(false); setLogoSize(0.4) }
  const setTab = (tab) => setCurrentTab(tab)
  
  const clearAll = () => {
    setUrlInput(''); setTextInput(''); setWifiSsid(''); setWifiPassword('')
    setEmailInput(''); setEmailSubject(''); setEmailBody(''); setPhoneInput('')
    generateQR()
  }

  const presets = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff', style: 'square', corner: 'square' },
    { name: 'Dark', fg: '#ffffff', bg: '#000000', style: 'square', corner: 'square' },
    { name: 'Ocean', fg: '#0a84ff', bg: '#001833', style: 'dot', corner: 'dot' },
    { name: 'Forest', fg: '#30d158', bg: '#042908', style: 'rounded', corner: 'extra-rounded' },
    { name: 'Sunset', fg: '#ff9f0a', bg: '#331a00', style: 'classy', corner: 'extra-rounded' },
    { name: 'Purple', fg: '#bf5af2', bg: '#1a0a2e', style: 'classy-rounded', corner: 'extra-rounded' },
  ]

  const applyPreset = (p) => { setColorFg(p.fg); setColorBg(p.bg); setQrStyle(p.style); setCornerStyle(p.corner); setBgTransparent(false) }
  const handlePayment = () => window.open('https://buy.stripe.com/9B6bJ11xH48nd2h4OZ3Nm02', '_blank')
  const sendEmail = async () => {
    const email = prompt('Enter email address:')
    if (email && qrCode) alert('QR code sent to ' + email + '!')
  }

  const patterns = ['square', 'dot', 'rounded', 'extra-rounded', 'classy', 'classy-rounded']
  const corners = ['square', 'dot', 'extra-rounded']

  return (
    <div className="app">
      <header>
        <div className="logo-mark"><img src="/logo.png" alt="QR Studio" /></div>
        <h1>QR Studio</h1>
        <p className="tagline">No subscriptions. Pay once, keep forever.</p>
        <p className="subtagline">Save immediately - no account, no database</p>
      </header>

      <div className="container">
        <div className="card input-section">
          <div className="tabs">
            {['URL', 'Text', 'WiFi', 'Email', 'Phone'].map(t => (
              <button key={t} className={currentTab === t.toLowerCase() ? 'active' : ''} onClick={() => setTab(t.toLowerCase())}>{t}</button>
            ))}
          </div>

          <div className="input-content">
            {currentTab === 'url' && <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://yourwebsite.com" className="main-input" />}
            {currentTab === 'text' && <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Your text..." className="main-input" />}
            {currentTab === 'wifi' && (
              <div className="input-group">
                <input type="text" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} placeholder="Network Name (SSID)" />
                <input type="password" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} placeholder="Password" />
                <select value={wifiType} onChange={e => setWifiType(e.target.value)}>
                  <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">No Encryption</option>
                </select>
              </div>
            )}
            {currentTab === 'email' && (
              <div className="input-group">
                <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Email Address" />
                <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Subject (optional)" />
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Message (optional)" />
              </div>
            )}
            {currentTab === 'phone' && <input type="tel" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="+1 (555) 123-4567" className="main-input" />}
          </div>

          <div className="quick-styles">
            <span className="label-light">Quick Styles</span>
            <div className="style-swatches">
              {presets.map(p => (
                <button key={p.name} className="style-swatch" style={{ background: p.bg }} onClick={() => applyPreset(p)} title={p.name}>
                  <div style={{ background: p.fg, width: 16, height: 16, borderRadius: 3 }}></div>
                </button>
              ))}
              <button className="style-swatch" style={{ background: 'repeating-conic-gradient(#333 0%25%, #222 0%50%) 50% / 8px 8px' }} onClick={() => { setBgTransparent(true); setColorFg('#000000') }} title="Transparent">
                <div style={{ background: '#000', width: 16, height: 16, borderRadius: 3, opacity: 0.5 }}></div>
              </button>
            </div>
          </div>

          <div className="styling">
            <div className="style-section">
              <span className="label-light">Colors</span>
              <div className="style-row">
                <div className="style-item">
                  <span className="label-light">Dots</span>
                  <div className="color-row">
                    <input type="color" value={colorFg} onChange={e => setColorFg(e.target.value)} />
                    <span>{colorFg}</span>
                  </div>
                </div>
                <div className="style-item">
                  <span className="label-light">Background</span>
                  <div className="color-row">
                    <input type="color" value={colorBg} onChange={e => setColorBg(e.target.value)} disabled={bgTransparent} />
                    <span>{bgTransparent ? '-' : colorBg}</span>
                  </div>
                </div>
              </div>
              <label className="checkbox"><input type="checkbox" checked={bgTransparent} onChange={e => setBgTransparent(e.target.checked)} /><span>Transparent</span></label>
            </div>

            <div className="style-section">
              <span className="label-light">Corners</span>
              <div className="style-row">
                <div className="style-item">
                  <span className="label-light">Style</span>
                  <div className="pattern-grid">
                    {corners.map(c => <button key={c} className={`pattern-btn ${cornerStyle === c ? 'active' : ''}`} onClick={() => setCornerStyle(c)}>{CornerIcons[c]}</button>)}
                  </div>
                </div>
              </div>
              <div className="style-row" style={{ marginTop: '0.5rem' }}>
                <div className="style-item"><div className="color-row"><input type="color" value={colorCornerSquare} onChange={e => setColorCornerSquare(e.target.value)} /><span>Square</span></div></div>
                <div className="style-item"><div className="color-row"><input type="color" value={colorCornerDot} onChange={e => setColorCornerDot(e.target.value)} /><span>Dot</span></div></div>
              </div>
            </div>

            <div className="style-section">
              <span className="label-light">Pattern</span>
              <div className="pattern-grid">
                {patterns.map(p => <button key={p} className={`pattern-btn ${qrStyle === p ? 'active' : ''}`} onClick={() => setQrStyle(p)} title={p}>{PatternIcons[p]}</button>)}
              </div>
            </div>

            <div className="style-section">
              <span className="label-light">Padding: {padding}px</span>
              <input type="range" min="0" max="60" step="4" value={padding} onChange={e => setPadding(parseInt(e.target.value))} className="slider" />
            </div>

            <div className="logo-section">
              <span className="label-light">Logo (center)</span>
              {!hasLogo ? (
                <div className="logo-upload">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} id="logo-file" />
                  <label htmlFor="logo-file" className="upload-btn">+ Add Logo</label>
                  <small>Auto-compresses large files</small>
                </div>
              ) : (
                <div className="logo-adjust">
                  <div className="logo-preview"><img src={logoUrl} alt="Logo" /><button className="remove-logo" onClick={clearLogo}></button></div>
                  <div className="logo-sliders">
                    <div className="slider-row"><span>Size</span><input type="range" min="0.15" max="0.5" step="0.05" value={logoSize} onChange={e => setLogoSize(parseFloat(e.target.value))} /></div>
                    <div className="slider-row"><span>Margin</span><input type="range" min="0" max="30" step="2" value={logoMargin} onChange={e => setLogoMargin(parseInt(e.target.value))} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card preview-section">
          <div className="preview-header">
            <span>Preview</span>
            <button className="clear-btn" onClick={clearAll}>Clear</button>
          </div>
          <div className="preview-frame" style={{ background: bgTransparent ? 'repeating-conic-gradient(#2a2a3a 0%25%, #1a1a2a 0%50%) 50% / 16px 16px' : colorBg }}>
            <div className="preview" ref={qrRef}></div>
          </div>
          
          {!hasContent() ? (
            <div className="hint-text">Enter content above to generate QR</div>
          ) : isPaid ? (
            <div className="download-btns">
              <button onClick={() => downloadQR('png')}><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-8 2h16v2H4v-2z"/></svg>PNG</button>
              <button onClick={() => downloadQR('svg')}><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-8 2h16v2H4v-2z"/></svg>SVG</button>
              <button onClick={sendEmail} className="email-btn"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>Email</button>
            </div>
          ) : (
            <div className="promo-card">
              <p>Pay to download your QR code</p>
              <button onClick={handlePayment} className="promo-btn">Pay $2 for Download</button>
              <p className="secure-text">Secure payment - Apple Pay - Google Pay</p>
            </div>
          )}
        </div>
      </div>
      <footer><span>qrgen.studio</span></footer>
    </div>
  )
}

export default App
