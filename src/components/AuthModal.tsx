import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { QRStyles } from '../lib/supabase'

interface AuthModalProps {
  qrData: {
    type: string
    data: Record<string, string>
    styles: QRStyles
  }
  onClose: () => void
  onSuccess: () => void
  onDownload: () => void
}

export function AuthModal({ qrData, onClose, onSuccess, onDownload }: AuthModalProps) {
  const [mode, setMode] = useState<'save' | 'login'>('save')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      // 1. Create auth user with password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (signUpError) {
        setErrorMsg(signUpError.message)
        setStatus('error')
        return
      }

      if (!authData.user) {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      // 2. Save QR code to their account
      const { error: qrError } = await supabase
        .from('qr_codes')
        .insert({
          user_id: authData.user.id,
          type: qrData.type,
          data: qrData.data,
          styles: qrData.styles
        })

      if (qrError) {
        console.error('QR save error:', qrError)
      }

      // 3. Track event
      await supabase.from('events').insert({
        user_id: authData.user.id,
        event_type: 'user_signed_up',
        event_data: { qr_type: qrData.type }
      })

      setStatus('success')
      
      // Trigger download and close after short delay
      setTimeout(() => {
        onDownload()
        onSuccess()
      }, 1000)
      
    } catch (err) {
      console.error('Signup error:', err)
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) {
        setErrorMsg('Invalid email or password')
        setStatus('error')
        return
      }

      if (!authData.user) {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      // Save QR to their account
      const { error: qrError } = await supabase
        .from('qr_codes')
        .insert({
          user_id: authData.user.id,
          type: qrData.type,
          data: qrData.data,
          styles: qrData.styles
        })

      if (qrError) {
        console.error('QR save error:', qrError)
      }

      // Track event
      await supabase.from('events').insert({
        user_id: authData.user.id,
        event_type: 'user_logged_in',
        event_data: { qr_type: qrData.type }
      })

      setStatus('success')
      
      setTimeout(() => {
        onDownload()
        onSuccess()
      }, 1000)
      
    } catch (err) {
      console.error('Login error:', err)
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const handleJustDownload = () => {
    onDownload()
    onClose()
  }

  if (status === 'success') {
    return (
      <div className="modal-overlay" onClick={onSuccess}>
        <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
          <div className="auth-success">
            <div className="success-icon">✅</div>
            <h3>Welcome!</h3>
            <p>Your QR code is being downloaded...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h3>{mode === 'save' ? 'Save your QR code' : 'Welcome back'}</h3>
          <p>
            {mode === 'save' 
              ? 'Create an account to save your QR codes and access them anytime.'
              : 'Sign in to save this QR code to your account.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="auth-toggle">
          <button 
            className={mode === 'save' ? 'active' : ''}
            onClick={() => setMode('save')}
          >
            Create Account
          </button>
          <button 
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={mode === 'save' ? handleSignUp : handleLogin}>
          {mode === 'save' && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'save'}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="form-input"
            />
          </div>

          {errorMsg && (
            <div className="auth-error">{errorMsg}</div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <span className="spinner-small"></span>
                {mode === 'save' ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              mode === 'save' ? 'Create Account & Download' : 'Sign In & Download'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="auth-skip-btn" onClick={handleJustDownload}>
          Just download, don't save
        </button>
      </div>
    </div>
  )
}
