import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our tables
export type Profile = {
  id: string
  email: string
  created_at: string
  stripe_customer_id?: string
  subscription_status: string
  marketing_consent: boolean
}

export type QRCode = {
  id: string
  user_id: string
  type: string
  data: Record<string, string>
  styles: QRStyles
  created_at: string
  updated_at: string
  download_count: number
  last_downloaded_at?: string
}

export type QRStyles = {
  fgColor: string
  bgColor: string
  dotsStyle: string
  cornersStyle: string
  gradientEnabled: boolean
  gradientColor1?: string
  gradientColor2?: string
  gradientType?: string
  logo?: string
  logoSize?: number
  logoMargin?: number
  usePlatformIcon?: boolean
  iconColor?: string
}

export type AnonymousSession = {
  id: string
  email?: string
  session_data: {
    qr_codes: Array<{
      type: string
      data: Record<string, string>
      styles: QRStyles
    }>
  }
  created_at: string
  converted_at?: string
  user_id?: string
}

export type Event = {
  id: string
  user_id?: string
  anonymous_session_id?: string
  event_type: string
  event_data: Record<string, any>
  created_at: string
}
