import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Setting up your account...')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get session_id from URL
        const params = new URLSearchParams(window.location.search)
        const sessionId = params.get('session_id')
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          return
        }

        if (sessionId) {
          // Convert anonymous session
          const { error: convertError } = await supabase.rpc(
            'convert_anonymous_session',
            { p_session_id: sessionId, p_user_id: session.user.id }
          )

          if (convertError) {
            console.error('Convert error:', convertError)
            // Continue anyway - user is still authenticated
          }

          // Update events to link to user
          await supabase.from('events')
            .update({ user_id: session.user.id })
            .eq('anonymous_session_id', sessionId)
        }

        setStatus('success')
        setMessage('Account created! Redirecting...')
        
        // Redirect to home after short delay
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
        
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }
    
    handleAuth()
  }, [])

  return (
    <div className="auth-callback">
      <div className={`status-icon ${status}`}>
        {status === 'loading' && <span className="spinner"></span>}
        {status === 'success' && '✅'}
        {status === 'error' && '❌'}
      </div>
      <h2>{message}</h2>
      {status === 'error' && (
        <a href="/" className="btn-primary">Go Home</a>
      )}
    </div>
  )
}
