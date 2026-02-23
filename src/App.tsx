import { useState, useRef, useEffect } from 'react'
import QRCodeStyling from 'qr-code-styling'
import './index.css'
import './App.css'

// QR Code Types
type QRType = 
  | 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' 
  | 'vcard' | 'event' 
  | 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'snapchat'
  | 'bitcoin' | 'paypal' | 'venmo' 
  | 'youtube' | 'spotify' | 'appstore' | 'googleplay' | 'amazon' | 'googlemaps' | 'applemaps'

interface QRTypeOption {
  id: QRType
  label: string
  icon: string
  category: 'core' | 'social' | 'payment' | 'platform' | 'business'
}

const qrTypes: QRTypeOption[] = [
  { id: 'url', label: 'URL', icon: '🔗', category: 'core' },
  { id: 'text', label: 'Text', icon: '📝', category: 'core' },
  { id: 'wifi', label: 'WiFi', icon: '📶', category: 'core' },
  { id: 'email', label: 'Email', icon: '✉️', category: 'core' },
  { id: 'phone', label: 'Phone', icon: '📞', category: 'core' },
  { id: 'sms', label: 'SMS', icon: '💬', category: 'core' },
  { id: 'vcard', label: 'vCard', icon: '👤', category: 'business' },
  { id: 'event', label: 'Event', icon: '📅', category: 'business' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💙', category: 'social' },
  { id: 'instagram', label: 'Instagram', icon: '📷', category: 'social' },
  { id: 'facebook', label: 'Facebook', icon: '👥', category: 'social' },
  { id: 'twitter', label: 'X/Twitter', icon: '🐦', category: 'social' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', category: 'social' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', category: 'social' },
  { id: 'snapchat', label: 'Snapchat', icon: '👻', category: 'social' },
  { id: 'bitcoin', label: 'Bitcoin', icon: '₿', category: 'payment' },
  { id: 'paypal', label: 'PayPal', icon: '💳', category: 'payment' },
  { id: 'venmo', label: 'Venmo', icon: '💰', category: 'payment' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', category: 'platform' },
  { id: 'spotify', label: 'Spotify', icon: '🎧', category: 'platform' },
  { id: 'appstore', label: 'App Store', icon: '🍎', category: 'platform' },
  { id: 'googleplay', label: 'Google Play', icon: '▶️', category: 'platform' },
  { id: 'amazon', label: 'Amazon', icon: '📦', category: 'platform' },
  { id: 'googlemaps', label: 'Google Maps', icon: '🗺️', category: 'platform' },
  { id: 'applemaps', label: 'Apple Maps', icon: '🍎', category: 'platform' },
]

const dotStyles = [
  { id: 'square', name: 'Square' },
  { id: 'dots', name: 'Dots' },
  { id: 'rounded', name: 'Rounded' },
  { id: 'extra-rounded', name: 'Extra Rounded' },
  { id: 'classy', name: 'Classy' },
  { id: 'classy-rounded', name: 'Classy Rounded' },
]

const cornerStyles = [
  { id: 'square', name: 'Square' },
  { id: 'dot', name: 'Dot' },
  { id: 'extra-rounded', name: 'Extra Rounded' },
]

const presets = [
  { name: 'Classic', fg: '#000000', bg: '#ffffff', dots: 'square', corners: 'square' },
  { name: 'Modern', fg: '#1a1a1a', bg: '#ffffff', dots: 'rounded', corners: 'extra-rounded' },
  { name: 'Ocean', fg: '#0a84ff', bg: '#f0f8ff', dots: 'dots', corners: 'dot' },
  { name: 'Forest', fg: '#30d158', bg: '#f0fff0', dots: 'rounded', corners: 'extra-rounded' },
  { name: 'Sunset', fg: '#ff9500', bg: '#fff8f0', dots: 'classy', corners: 'extra-rounded' },
  { name: 'Purple', fg: '#af52de', bg: '#faf0ff', dots: 'classy-rounded', corners: 'extra-rounded' },
  { name: 'Dark', fg: '#ffffff', bg: '#1a1a1a', dots: 'square', corners: 'square' },
  { name: 'Transparent', fg: '#000000', bg: 'transparent', dots: 'square', corners: 'square' },
]

function App() {
  const [qrType, setQrType] = useState<QRType>('url')
  const [qr, setQr] = useState<QRCodeStyling | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)
  
  // Form state
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState('WPA')
  const [email, setEmail] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [phone, setPhone] = useState('')
  const [smsBody, setSmsBody] = useState('')
  
  // vCard
  const [vCardFirstName, setVCardFirstName] = useState('')
  const [vCardLastName, setVCardLastName] = useState('')
  const [vCardPhone, setVCardPhone] = useState('')
  const [vCardEmail, setVCardEmail] = useState('')
  const [vCardCompany, setVCardCompany] = useState('')
  const [vCardTitle, setVCardTitle] = useState('')
  const [vCardWebsite, setVCardWebsite] = useState('')
  
  // Event
  const [eventTitle, setEventTitle] = useState('')
  const [eventStart, setEventStart] = useState('')
  const [eventEnd, setEventEnd] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  
  // Social
  const [socialHandle, setSocialHandle] = useState('')
  const [socialMessage, setSocialMessage] = useState('')
  
  // Payment
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [cryptoAmount, setCryptoAmount] = useState('')
  const [paymentHandle, setPaymentHandle] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  
  // Platform
  const [platformUrl, setPlatformUrl] = useState('')
  
  // Style options
  const [dotsStyle, setDotsStyle] = useState('square')
  const [cornersStyle, setCornersStyle] = useState('square')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgTransparent, setBgTransparent] = useState(false)
  const [gradientEnabled, setGradientEnabled] = useState(false)
  const [gradientColor1, setGradientColor1] = useState('#007AFF')
  const [gradientColor2, setGradientColor2] = useState('#5856D6')
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [logo, setLogo] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.4)
  const [logoMargin, setLogoMargin] = useState(5)
  const [qrSize, setQrSize] = useState(300)
  
  const [showAllTypes, setShowAllTypes] = useState(false)

  const generateQRData = (): string => {
    switch (qrType) {
      case 'url':
        return url.trim() || 'https://qrgen.studio'
      case 'text':
        return text.trim() || 'Your text here'
      case 'wifi':
        return wifiSsid ? `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;` : ''
      case 'email':
        let mailto = `mailto:${email}`
        const params = []
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`)
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`)
        return params.length ? `${mailto}?${params.join('&')}` : mailto
      case 'phone':
        return phone ? `tel:${phone.replace(/\D/g, '')}` : ''
      case 'sms':
        const smsNum = phone.replace(/\D/g, '')
        return smsBody ? `sms:${smsNum}?body=${encodeURIComponent(smsBody)}` : `sms:${smsNum}`
      case 'vcard':
        const fn = `${vCardFirstName} ${vCardLastName}`.trim()
        let vcard = 'BEGIN:VCARD\nVERSION:3.0'
        if (fn) vcard += `\nFN:${fn}\nN:${vCardLastName};${vCardFirstName};;;`
        if (vCardPhone) vcard += `\nTEL:${vCardPhone}`
        if (vCardEmail) vcard += `\nEMAIL:${vCardEmail}`
        if (vCardCompany) vcard += `\nORG:${vCardCompany}`
        if (vCardTitle) vcard += `\nTITLE:${vCardTitle}`
        if (vCardWebsite) vcard += `\nURL:${vCardWebsite}`
        vcard += '\nEND:VCARD'
        return vcard
      case 'event':
        const start = eventStart.replace(/[-:]/g, '').replace('T', 'T')
        const end = eventEnd.replace(/[-:]/g, '').replace('T', 'T')
        let ical = 'BEGIN:VEVENT\n'
        if (eventTitle) ical += `SUMMARY:${eventTitle}\n`
        if (start) ical += `DTSTART:${start}00\n`
        if (end) ical += `DTEND:${end}00\n`
        if (eventLocation) ical += `LOCATION:${eventLocation}\n`
        if (eventDescription) ical += `DESCRIPTION:${eventDescription}\n`
        ical += 'END:VEVENT'
        return ical
      case 'whatsapp':
        const waNum = phone.replace(/\D/g, '')
        return socialMessage ? `https://wa.me/${waNum}?text=${encodeURIComponent(socialMessage)}` : `https://wa.me/${waNum}`
      case 'instagram':
        const igHandle = socialHandle.replace('@', '').replace('instagram.com/', '')
        return `https://instagram.com/${igHandle}`
      case 'facebook':
        const fbHandle = socialHandle.replace('facebook.com/', '').replace('@', '')
        return `https://facebook.com/${fbHandle}`
      case 'twitter':
        const twHandle = socialHandle.replace('@', '').replace('twitter.com/', '').replace('x.com/', '')
        return `https://twitter.com/${twHandle}`
      case 'linkedin':
        const liHandle = socialHandle.replace('linkedin.com/', '').replace('in/', '')
        return `https://linkedin.com/in/${liHandle}`
      case 'tiktok':
        const ttHandle = socialHandle.replace('@', '').replace('tiktok.com/', '')
        return `https://tiktok.com/@${ttHandle}`
      case 'snapchat':
        const scHandle = socialHandle.replace('@', '').replace('snapchat.com/add/', '')
        return `https://snapchat.com/add/${scHandle}`
      case 'bitcoin':
        let btc = `bitcoin:${cryptoAddress}`
        const btcParams = []
        if (cryptoAmount) btcParams.push(`amount=${cryptoAmount}`)
        return btcParams.length ? `${btc}?${btcParams.join('&')}` : btc
      case 'paypal':
        return paymentAmount ? `https://paypal.me/${paymentHandle}/${paymentAmount}` : `https://paypal.me/${paymentHandle}`
      case 'venmo':
        return socialMessage ? `https://venmo.com/${paymentHandle}?note=${encodeURIComponent(socialMessage)}` : `https://venmo.com/${paymentHandle}`
      case 'youtube':
        const ytId = platformUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1]
        return ytId ? `https://youtube.com/watch?v=${ytId}` : platformUrl || 'https://youtube.com'
      case 'spotify':
        return platformUrl || 'https://spotify.com'
      case 'appstore':
        const appId = platformUrl.match(/id(\d+)/)?.[1]
        return appId ? `https://apps.apple.com/app/id${appId}` : platformUrl || 'https://apps.apple.com'
      case 'googleplay':
        const pkg = platformUrl.match(/id=([^&]+)/)?.[1]
        return pkg ? `https://play.google.com/store/apps/details?id=${pkg}` : platformUrl || 'https://play.google.com'
      case 'amazon':
        return platformUrl || 'https://amazon.com'
      case 'googlemaps':
        const coords = platformUrl.match(/[-.\d]+,[-.\d]+/)?.[0]
        return coords ? `https://www.google.com/maps?q=${coords}` : platformUrl || 'https://maps.google.com'
      case 'applemaps':
        const appleCoords = platformUrl.match(/[-.\d]+,[-.\d]+/)?.[0]
        return appleCoords ? `http://maps.apple.com/?q=${appleCoords}` : platformUrl || 'http://maps.apple.com'
      default:
        return url || 'https://qrgen.studio'
    }
  }

  const updateQR = () => {
    if (!qrRef.current) return
    qrRef.current.innerHTML = ''
    
    const data = generateQRData()
    const options = {
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
    }
    
    const newQr = new QRCodeStyling(options)
    newQr.append(qrRef.current)
    setQr(newQr)
  }

  useEffect(() => {
    updateQR()
  }, [qrType, url, text, wifiSsid, wifiPassword, wifiType, email, emailSubject, emailBody, phone, smsBody,
      vCardFirstName, vCardLastName, vCardPhone, vCardEmail, vCardCompany, vCardTitle, vCardWebsite,
      eventTitle, eventStart, eventEnd, eventLocation, eventDescription, socialHandle, socialMessage,
      cryptoAddress, cryptoAmount, paymentHandle, paymentAmount, platformUrl,
      dotsStyle, cornersStyle, fgColor, bgColor,
      bgTransparent, gradientEnabled, gradientColor1, gradientColor2, gradientType, logo, logoSize, logoMargin, qrSize])

  const handleDownload = (format: 'png' | 'svg' | 'jpeg') => {
    if (qr) {
      qr.download({ name: 'qr-code', extension: format })
    }
  }

  const applyPreset = (preset: typeof presets[0]) => {
    setFgColor(preset.fg)
    setBgColor(preset.bg)
    setDotsStyle(preset.dots)
    setCornersStyle(preset.corners)
    setBgTransparent(preset.bg === 'transparent')
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const renderForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="form-group">
            <label>Website URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourwebsite.com" />
          </div>
        )
      case 'text':
        return (
          <div className="form-group">
            <label>Your Text</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter any text..." rows={4} />
          </div>
        )
      case 'wifi':
        return (
          <>
            <div className="form-group">
              <label>Network Name (SSID)</label>
              <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="My WiFi" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" />
            </div>
            <div className="form-group">
              <label>Security Type</label>
              <select value={wifiType} onChange={(e) => setWifiType(e.target.value)}>
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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Subject (optional)</label>
              <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Email subject" />
            </div>
            <div className="form-group">
              <label>Message (optional)</label>
              <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Email body" rows={3} />
            </div>
          </>
        )
      case 'phone':
        return (
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
        )
      case 'sms':
        return (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder="SMS message" rows={3} />
            </div>
          </>
        )
      case 'vcard':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" value={vCardFirstName} onChange={(e) => setVCardFirstName(e.target.value)} placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" value={vCardLastName} onChange={(e) => setVCardLastName(e.target.value)} placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={vCardEmail} onChange={(e) => setVCardEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" value={vCardCompany} onChange={(e) => setVCardCompany(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" value={vCardTitle} onChange={(e) => setVCardTitle(e.target.value)} placeholder="CEO" />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input type="url" value={vCardWebsite} onChange={(e) => setVCardWebsite(e.target.value)} placeholder="https://example.com" />
            </div>
          </>
        )
      case 'event':
        return (
          <>
            <div className="form-group">
              <label>Event Title</label>
              <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Meeting" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start</label>
                <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} />
              </div>
              <div className="form-group">
                <label>End</label>
                <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Conference Room A" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Event details" rows={3} />
            </div>
          </>
        )
      case 'whatsapp':
        return (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Pre-filled Message</label>
              <textarea value={socialMessage} onChange={(e) => setSocialMessage(e.target.value)} placeholder="Hello!" rows={2} />
            </div>
          </>
        )
      case 'instagram':
      case 'facebook':
      case 'twitter':
      case 'linkedin':
      case 'tiktok':
      case 'snapchat':
      case 'venmo':
        return (
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={socialHandle} onChange={(e) => setSocialHandle(e.target.value)} placeholder={qrType === 'instagram' ? '@username' : 'username'} />
          </div>
        )
      case 'bitcoin':
        return (
          <>
            <div className="form-group">
              <label>Bitcoin Address</label>
              <input type="text" value={cryptoAddress} onChange={(e) => setCryptoAddress(e.target.value)} placeholder="bc1q..." />
            </div>
            <div className="form-group">
              <label>Amount (BTC) - optional</label>
              <input type="number" value={cryptoAmount} onChange={(e) => setCryptoAmount(e.target.value)} placeholder="0.01" step="0.0001" />
            </div>
          </>
        )
      case 'paypal':
        return (
          <>
            <div className="form-group">
              <label>PayPal Username</label>
              <input type="text" value={paymentHandle} onChange={(e) => setPaymentHandle(e.target.value)} placeholder="username" />
            </div>
            <div className="form-group">
              <label>Amount - optional</label>
              <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="10.00" step="0.01" />
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
            <input type="url" value={platformUrl} onChange={(e) => setPlatformUrl(e.target.value)} placeholder="https://..." />
          </div>
        )
      default:
        return null
    }
  }

  const displayedTypes = showAllTypes ? qrTypes : qrTypes.slice(0, 8)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">QR Studio</span>
        </div>
        <p className="tagline">Beautiful QR codes, one click away</p>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Left Panel - Form */}
        <div className="panel form-panel">
          {/* QR Type Selector */}
          <div className="section">
            <h3>What type of QR?</h3>
            <div className="type-grid">
              {displayedTypes.map((type) => (
                <button
                  key={type.id}
                  className={`type-btn ${qrType === type.id ? 'active' : ''}`}
                  onClick={() => setQrType(type.id)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
            {qrTypes.length > 8 && (
              <button className="show-more-btn" onClick={() => setShowAllTypes(!showAllTypes)}>
                {showAllTypes ? 'Show Less' : `Show All (${qrTypes.length})`}
              </button>
            )}
          </div>

          {/* Data Form */}
          <div className="section">
            <h3>Enter Details</h3>
            {renderForm()}
          </div>

          {/* Style Options */}
          <div className="section">
            <h3>Style</h3>
            
            {/* Presets */}
            <div className="preset-grid">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                  style={{ background: preset.bg === 'transparent' ? 'repeating-conic-gradient(#ccc 0 25%, #eee 0 50%) 50% / 8px 8px' : preset.bg }}
                >
                  <div style={{ background: preset.fg, width: 16, height: 16, borderRadius: 3 }} />
                </button>
              ))}
            </div>

            {/* Dot Pattern */}
            <div className="option-group">
              <label>Dot Pattern</label>
              <div className="pattern-grid">
                {dotStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`pattern-btn ${dotsStyle === style.id ? 'active' : ''}`}
                    onClick={() => setDotsStyle(style.id)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Style */}
            <div className="option-group">
              <label>Corner Style</label>
              <div className="pattern-grid">
                {cornerStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`pattern-btn ${cornersStyle === style.id ? 'active' : ''}`}
                    onClick={() => setCornersStyle(style.id)}
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
                      Transparent
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient */}
            <div className="option-group">
              <label className="toggle-label">
                <input type="checkbox" checked={gradientEnabled} onChange={(e) => setGradientEnabled(e.target.checked)} />
                <span>Enable Gradient</span>
              </label>
              {gradientEnabled && (
                <div className="color-row">
                  <div className="color-picker-group">
                    <span>Color 1</span>
                    <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} />
                  </div>
                  <div className="color-picker-group">
                    <span>Color 2</span>
                    <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} />
                  </div>
                  <select value={gradientType} onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}>
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
              )}
            </div>

            {/* Logo */}
            <div className="option-group">
              <label>Logo</label>
              {logo ? (
                <div className="logo-preview-wrap">
                  <div className="logo-preview">
                    <img src={logo} alt="Logo" />
                    <button className="remove-logo" onClick={() => setLogo(null)}>×</button>
                  </div>
                  <div className="logo-sliders">
                    <label>
                      <span>Size</span>
                      <input type="range" min="0.1" max="0.5" step="0.05" value={logoSize} onChange={(e) => setLogoSize(parseFloat(e.target.value))} />
                    </label>
                    <label>
                      <span>Margin</span>
                      <input type="range" min="0" max="20" step="1" value={logoMargin} onChange={(e) => setLogoMargin(parseInt(e.target.value))} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="upload-btn-label">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} />
                  <span>+ Add Logo</span>
                </label>
              )}
            </div>

            {/* Size */}
            <div className="option-group">
              <label>Size: {qrSize}px</label>
              <input type="range" min="200" max="1000" step="100" value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="panel preview-panel">
          <div className="preview-card">
            <div ref={qrRef} />
          </div>
          <div className="download-btns">
            <button onClick={() => handleDownload('png')}>PNG</button>
            <button onClick={() => handleDownload('svg')}>SVG</button>
            <button onClick={() => handleDownload('jpeg')}>JPEG</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>© 2026 QR Studio — No account required</p>
      </footer>
    </div>
  )
}

export default App
