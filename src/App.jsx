import { useState, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('url')
  const [qrCode, setQrCode] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const [hasLogo, setHasLogo] = useState(false)
  const qrRef = useRef(null)

  const [urlInput, setUrlInput] = useState('https://example.com')
  const [textInput, setTextInput] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState('WPA')
  const [emailInput, setEmailInput] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  const [colorFg, setColorFg] = useState('#000000')
  const [colorBg, setColorBg] = useState('#ffffff')
  const [qrStyle, setQrStyle] = useState('square')
  const [cornerStyle, setCornerStyle] = useState('square')

  const getQRData = () => {
    switch(currentTab) {
      case 'url':
        return urlInput || 'https://example.com'
      case 'text':
        return textInput || 'Hello World'
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`
      case 'email':
        let mailto = `mailto:${emailInput}`
        const params = []
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`)
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`)
        if (params.length) mailto += '?' + params.join('&')
        return mailto
      default:
        return 'https://example.com'
    }
  }

  const generateQR = () => {
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
    }
    
    const data = getQRData()
    const qr = new QRCodeStyling({
      width: 300,
      height: 300,
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
        margin: 10
      }
    })

    qr.append(qrRef.current)
    setQrCode(qr)
  }

  const downloadQR = (format) => {
    if (qrCode) {
      qrCode.download({ name: "qr-code", extension: format })
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Logo must be less than 1MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoUrl(e.target.result)
        setHasLogo(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const setTab = (tab) => {
    setCurrentTab(tab)
  }

  return (
    <div className="app">
      <header>
        <h1>QR Code Generator</h1>
        <p>Beautiful, customizable QR codes with logo support</p>
      </header>

      <div className="container">
        <div className="card input-section">
          <div className="tabs">
            <button className={currentTab === 'url' ? 'active' : ''} onClick={() => setTab('url')}>URL</button>
            <button className={currentTab === 'text' ? 'active' : ''} onClick={() => setTab('text')}>Text</button>
            <button className={currentTab === 'wifi' ? 'active' : ''} onClick={() => setTab('wifi')}>WiFi</button>
            <button className={currentTab === 'email' ? 'active' : ''} onClick={() => setTab('email')}>Email</button>
          </div>

          {currentTab === 'url' && (
            <div className="input-group">
              <label>Enter URL</label>
              <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://yourwebsite.com" />
            </div>
          )}

          {currentTab === 'text' && (
            <div className="input-group">
              <label>Enter Text</label>
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Your text here..." />
            </div>
          )}

          {currentTab === 'wifi' && (
            <div className="input-group">
              <label>WiFi Network</label>
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
              <label>Email Address</label>
              <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="you@example.com" />
              <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Subject (optional)" />
              <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Body (optional)" />
            </div>
          )}

          <div className="styling">
            <h3>Styling Options</h3>
            
            <div className="colors">
              <div>
                <label>Foreground</label>
                <div className="color-picker">
                  <input type="color" value={colorFg} onChange={(e) => setColorFg(e.target.value)} />
                  <span>{colorFg}</span>
                </div>
              </div>
              <div>
                <label>Background</label>
                <div className="color-picker">
                  <input type="color" value={colorBg} onChange={(e) => setColorBg(e.target.value)} />
                  <span>{colorBg}</span>
                </div>
              </div>
            </div>

            <div>
              <label>QR Style</label>
              <select value={qrStyle} onChange={(e) => setQrStyle(e.target.value)}>
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="rounded">Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
              </select>
            </div>

            <div>
              <label>Corner Style</label>
              <select value={cornerStyle} onChange={(e) => setCornerStyle(e.target.value)}>
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>

            <div>
              <label>Logo (center image) - $2</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
              <small>PNG, JPG up to 1MB</small>
            </div>
          </div>

          <button className="btn-primary" onClick={generateQR}>Generate QR Code</button>
        </div>

        <div className="card preview-section">
          <div className="preview" ref={qrRef}>
            <div className="placeholder">QR code will appear here</div>
          </div>
          
          {qrCode && (
            <div className="download-options">
              <div className="buttons">
                <button onClick={() => downloadQR('png')}>Download PNG</button>
                <button onClick={() => downloadQR('svg')}>Download SVG</button>
              </div>
              
              {hasLogo && (
                <a href="https://buy.stripe.com/9B6bJ11xH48nd2h4OZ3Nm02" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  🖼️ Add Logo - $2
                </a>
              )}
            </div>
          )}

          <div className="plans">
            <h3>Short URLs + Analytics</h3>
            <a href="https://buy.stripe.com/7sYeVd7W548n8M195f3Nm03" target="_blank" rel="noopener noreferrer" className="plan">
              <span>5 URLs + Analytics</span>
              <span className="price">$5/mo</span>
            </a>
            <a href="https://buy.stripe.com/6oU3cv3FP9sHe6l5T33Nm04" target="_blank" rel="noopener noreferrer" className="plan">
              <span>20 URLs + Analytics</span>
              <span className="price">$15/mo</span>
            </a>
            <a href="https://buy.stripe.com/eVqbJ1ektcETbYd95f3Nm05" target="_blank" rel="noopener noreferrer" className="plan">
              <span>100 URLs + Analytics</span>
              <span className="price">$50/mo</span>
            </a>
          </div>
        </div>
      </div>

      <footer>© 2026 QR Code Generator</footer>
    </div>
  )
}

export default App
