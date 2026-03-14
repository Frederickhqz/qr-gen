import { useState, useEffect, useCallback } from 'react'
import { supabase, type Profile } from '../lib/supabase'

export interface User {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email ?? '',
        user_metadata: session.user.user_metadata
      } : null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email ?? '',
        user_metadata: session.user.user_metadata
      } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data as Profile)
      }
    }

    fetchProfile()
  }, [user])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  return {
    user,
    profile,
    isLoading,
    signOut,
    setUser
  }
}
