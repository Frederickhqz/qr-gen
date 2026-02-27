import { useEffect, useState, useRef } from 'react'
// Use dynamic import for qr-code-styling to ensure correct constructor at runtime
// import QRCodeStyling from 'qr-code-styling'
import { supabase } from '../lib/supabase'
import type { QRCode, QRStyles } from '../lib/supabase'

interface QRHistoryModalProps {
  user: any
  onClose: () => void
}

export function QRHistoryModal({ user, onClose }: QRHistoryModalProps) {
  const [codes, setCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const qrRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (user) {
      loadHistory(user.id)
    }
  }, [user])

  useEffect(() => {
    // Render QR codes after loading
    codes.forEach((qr) => {
      const container = qrRefs.current.get(qr.id)
      if (container) {
        void renderQR(qr, container)
      }
    })
  }, [codes])

  const loadHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load history:', error)
    }

    setCodes(data || [])
    setLoading(false)
  }

  const renderQR = async (qr: QRCode, container: HTMLDivElement) => {
    container.innerHTML = ''

    const mod = await import('qr-code-styling')
    const QRCodeStyling = (mod as any).default || (mod as any)
    
    const styles: QRStyles = qr.styles as QRStyles
    
    // Generate the actual QR data from stored data
    let qrData = ''
    if (qr.type === 'url') qrData = qr.data.url || 'https://example.com'
    else if (qr.type === 'wifi') qrData = `WIFI:T:${qr.data.encryption || 'WPA'};S:${qr.data.ssid};P:${qr.data.password};;`
    else if (qr.type === 'email') qrData = `mailto:${qr.data.email}?subject=${encodeURIComponent(qr.data.subject || '')}&body=${encodeURIComponent(qr.data.body || '')}`
    else if (qr.type === 'phone') qrData = `tel:${qr.data.phone}`
    else if (qr.type === 'sms') qrData = `sms:${qr.data.phone}?body=${encodeURIComponent(qr.data.message || '')}`
    else if (qr.type === 'vcard') qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${qr.data.name}\nTEL:${qr.data.phone}\nEMAIL:${qr.data.email}\nEND:VCARD`
    else if (qr.type === 'text') qrData = qr.data.text || ''
    else qrData = JSON.stringify(qr.data)

    const qrCode = new QRCodeStyling({
      width: 120,
      height: 120,
      data: qrData,
      dotsOptions: {
        color: styles.fgColor,
        type: styles.dotsStyle as any,
        ...(styles.gradientEnabled && {
          gradient: {
            type: styles.gradientType || 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: styles.gradientColor1 || styles.fgColor },
              { offset: 1, color: styles.gradientColor2 || styles.fgColor }
            ]
          }
        })
      },
      backgroundOptions: {
        color: styles.bgColor === 'transparent' ? '#ffffff' : styles.bgColor,
      },
      cornersSquareOptions: {
        type: styles.cornersStyle as any,
        color: styles.fgColor,
      },
      cornersDotOptions: {
        type: styles.cornersStyle as any,
        color: styles.fgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: styles.logoMargin || 5,
        imageSize: styles.logoSize || 0.35,
      },
    })

    await qrCode.append(container)
  }

  const handleDownload = async (qr: QRCode) => {
    // Track download
    await supabase.from('qr_codes')
      .update({ 
        download_count: (qr.download_count || 0) + 1,
        last_downloaded_at: new Date().toISOString()
      })
      .eq('id', qr.id)

    // Generate full-size QR for download
    const container = qrRefs.current.get(qr.id)
    if (!container) return

    const mod = await import('qr-code-styling')
    const QRCodeStyling = (mod as any).default || (mod as any)

    const styles: QRStyles = qr.styles as QRStyles
    
    let qrData = ''
    if (qr.type === 'url') qrData = qr.data.url || 'https://example.com'
    else if (qr.type === 'wifi') qrData = `WIFI:T:${qr.data.encryption || 'WPA'};S:${qr.data.ssid};P:${qr.data.password};;`
    else if (qr.type === 'email') qrData = `mailto:${qr.data.email}?subject=${encodeURIComponent(qr.data.subject || '')}&body=${encodeURIComponent(qr.data.body || '')}`
    else if (qr.type === 'phone') qrData = `tel:${qr.data.phone}`
    else if (qr.type === 'sms') qrData = `sms:${qr.data.phone}?body=${encodeURIComponent(qr.data.message || '')}`
    else if (qr.type === 'vcard') qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${qr.data.name}\nTEL:${qr.data.phone}\nEMAIL:${qr.data.email}\nEND:VCARD`
    else if (qr.type === 'text') qrData = qr.data.text || ''
    else qrData = JSON.stringify(qr.data)

    const downloadQR = new QRCodeStyling({
      width: 800,
      height: 800,
      data: qrData,
      dotsOptions: {
        color: styles.fgColor,
        type: styles.dotsStyle as any,
        ...(styles.gradientEnabled && {
          gradient: {
            type: styles.gradientType || 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: styles.gradientColor1 || styles.fgColor },
              { offset: 1, color: styles.gradientColor2 || styles.fgColor }
            ]
          }
        })
      },
      backgroundOptions: {
        color: styles.bgColor === 'transparent' ? '#ffffff' : styles.bgColor,
      },
      cornersSquareOptions: {
        type: styles.cornersStyle as any,
        color: styles.fgColor,
      },
      cornersDotOptions: {
        type: styles.cornersStyle as any,
        color: styles.fgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: styles.logoMargin || 5,
        imageSize: styles.logoSize || 0.35,
      },
    })

    const hiddenContainer = document.createElement('div')
    hiddenContainer.style.position = 'absolute'
    hiddenContainer.style.left = '-9999px'
    document.body.appendChild(hiddenContainer)
    
    try {
      await downloadQR.append(hiddenContainer)
      await downloadQR.download({ name: `qr-${qr.type}`, extension: 'png' })
    } finally {
      document.body.removeChild(hiddenContainer)
    }

    // Refresh to show updated count
    loadHistory(user.id)
  }

  const handleDelete = async (qrId: string) => {
    const confirmed = confirm('Delete this QR code? This cannot be undone.')
    if (!confirmed) return

    await supabase.from('qr_codes').delete().eq('id', qrId)
    loadHistory(user.id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="history-header">
          <h2>My QR Codes</h2>
          <p>Your saved QR codes are stored here</p>
        </div>

        {loading ? (
          <div className="history-loading">Loading...</div>
        ) : codes.length === 0 ? (
          <div className="history-empty">
            <div className="empty-icon">📱</div>
            <h3>No saved QR codes yet</h3>
            <p>Generate and download a QR code to save it here.</p>
          </div>
        ) : (
          <div className="history-list">
            {codes.map((qr) => (
              <div key={qr.id} className="history-item">
                <div 
                  className="history-qr-preview"
                  ref={(el) => {
                    if (el) qrRefs.current.set(qr.id, el)
                  }}
                />
                
                <div className="history-info">
                  <div className="history-type">{qr.type}</div>
                  <div className="history-meta">
                    {new Date(qr.created_at).toLocaleDateString()} • {qr.download_count} downloads
                  </div>
                </div>
                
                <div className="history-actions">
                  <button 
                    className="history-btn download"
                    onClick={() => handleDownload(qr)}
                    title="Download"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                  
                  <button 
                    className="history-btn delete"
                    onClick={() => handleDelete(qr.id)}
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
