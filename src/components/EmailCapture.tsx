import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { QRStyles } from '../lib/supabase'

interface EmailCaptureProps {
  qrData: {
    type: string
    data: Record<string, string>
    styles: QRStyles
  }
  onClose: () => void
  onSuccess: () => void
}

export function EmailCapture({ qrData, onClose, onSuccess }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('sending')

    try {
      // 1. Create anonymous session with QR data
      const { data: session, error: sessionError } = await supabase
        .from('anonymous_sessions')
        .insert({
          email,
          session_data: { qr_codes: [qrData] }
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Session error:', sessionError)
        setStatus('error')
        return
      }

      // 2. Send magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/#/auth/callback?session_id=${session.id}`,
          data: {
            qr_session_id: session.id
          }
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        setStatus('error')
        return
      }

      // 3. Track event
      await supabase.from('events').insert({
        anonymous_session_id: session.id,
        event_type: 'email_captured',
        event_data: { qr_type: qrData.type }
      })

      setStatus('sent')
    } catch (err) {
      console.error('Unexpected error:', err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="modal-overlay" onClick={onSuccess}>
        <div className="modal email-capture-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✅</div>
          <h3>Check your email!</h3>
          <p>We sent you a magic link. Click it to save your QR code and access your history anytime.</p>
          <button className="btn-primary" onClick={onSuccess}>Got it</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal email-capture-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h3>Save your QR code? 📧</h3>
        <p>Enter your email to save this QR code and access your history anytime.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="form-input"
            />
          </div>
          
          {status === 'error' && (
            <p className="error-text">Something went wrong. Try again.</p>
          )}
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Save QR Code'}
          </button>
        </form>
        
        <button className="btn-secondary" onClick={onClose}>
          No thanks, just download
        </button>
      </div>
    </div>
  )
}
