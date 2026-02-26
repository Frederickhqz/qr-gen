import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { QRCode } from '../lib/supabase'

export function QRHistory() {
  const [codes, setCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      loadHistory(session.user.id)
    } else {
      setLoading(false)
    }
  }

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCodes([])
  }

  if (!user) {
    return (
      <div className="qr-history-empty">
        <p>Sign in to see your saved QR codes</p>
      </div>
    )
  }

  if (loading) {
    return <div className="qr-history-loading">Loading...</div>
  }

  if (codes.length === 0) {
    return (
      <div className="qr-history-empty">
        <p>No saved QR codes yet.</p>
        <p>Generate and download a QR code to get started!</p>
      </div>
    )
  }

  return (
    <div className="qr-history">
      <div className="qr-history-header">
        <h3>Your QR Codes ({codes.length})</h3>
        <button className="btn-text" onClick={handleSignOut}>Sign out</button>
      </div>
      
      <div className="qr-history-list">
        {codes.map((qr) => (
          <div key={qr.id} className="qr-history-item">
            <div className="qr-info">
              <span className="qr-type">{qr.type}</span>
              <span className="qr-date">{new Date(qr.created_at).toLocaleDateString()}</span>
            </div>
            <div className="qr-stats">
              <span>{qr.download_count} downloads</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
