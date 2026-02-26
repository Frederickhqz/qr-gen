# QR Studio - Supabase Integration Plan

## Overview
Lightweight user tracking without blocking anonymous usage. Email capture at point of value (post-download).

---

## Database Schema

### 1. Users (via Supabase Auth)
Handled automatically by Supabase Auth. We create a profile record when user confirms email.

### 2. Profiles Table
```sql
-- Custom user data linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  stripe_customer_id text,
  subscription_status text default 'none', -- none, active, canceled
  marketing_consent boolean default true
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

### 3. QR Codes Table
```sql
-- Saved QR codes with full styling
create table public.qr_codes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  type text not null, -- url, wifi, email, etc.
  data jsonb not null, -- the actual QR data { url: "...", ssid: "..." }
  styles jsonb not null, -- { fgColor, bgColor, dotsStyle, etc. }
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  download_count integer default 0,
  last_downloaded_at timestamp with time zone
);

-- Index for fast user lookups
create index idx_qr_codes_user_id on public.qr_codes(user_id);
create index idx_qr_codes_created_at on public.qr_codes(created_at desc);

-- RLS: Users can only access their own QR codes
create policy "Users can CRUD own QR codes"
  on public.qr_codes for all
  using (auth.uid() = user_id);
```

### 4. Anonymous Sessions Table (Pre-auth tracking)
```sql
-- Track before user creates account
create table public.anonymous_sessions (
  id uuid default gen_random_uuid() primary key,
  email text,
  session_data jsonb, -- { qr_codes: [], events: [] }
  created_at timestamp with time zone default now(),
  converted_at timestamp with time zone,
  user_id uuid references auth.users -- filled when they confirm email
);

-- Index for email lookups
create index idx_anonymous_email on public.anonymous_sessions(email);
```

### 5. Events Table (Analytics)
```sql
-- Track actions for future analytics
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  anonymous_session_id uuid references public.anonymous_sessions on delete set null,
  event_type text not null, -- qr_generated, qr_downloaded, style_changed, etc.
  event_data jsonb, -- { qr_type: "wifi", style: "dots", etc. }
  created_at timestamp with time zone default now()
);

-- Index for analytics queries
create index idx_events_user_id on public.events(user_id);
create index idx_events_type_time on public.events(event_type, created_at);
```

---

## Frontend Implementation

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our tables
export type QRCode = {
  id: string
  user_id: string
  type: string
  data: Record<string, string>
  styles: QRStyles
  created_at: string
  download_count: number
}

export type QRStyles = {
  fgColor: string
  bgColor: string
  dotsStyle: string
  cornersStyle: string
  gradientEnabled: boolean
  gradientColor1?: string
  gradientColor2?: string
  logo?: string
}
```

### 3. Add to `.env`
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Email Capture Component (`src/components/EmailCapture.tsx`)
```tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface EmailCaptureProps {
  qrData: {
    type: string
    data: Record<string, string>
    styles: any
  }
  onClose: () => void
  onSuccess: () => void
}

export function EmailCapture({ qrData, onClose, onSuccess }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // 1. Create anonymous session
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

    // 2. Send magic link (creates auth user on confirm)
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?session_id=${session.id}`,
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
  }

  if (status === 'sent') {
    return (
      <div className="email-capture-success">
        <h3>✅ Check your email!</h3>
        <p>Click the link to save your QR code and access your history.</p>
        <button onClick={onSuccess}>Got it</button>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal email-capture-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Save your QR code?</h3>
        <p>Enter your email to save this QR code and access your history anytime.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          
          {status === 'error' && (
            <p className="error">Something went wrong. Try again.</p>
          )}
          
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Save QR Code'}
          </button>
        </form>
        
        <button className="secondary" onClick={onClose}>
          No thanks, just download
        </button>
      </div>
    </div>
  )
}
```

### 5. Auth Callback Handler (`src/components/AuthCallback.tsx`)
```tsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const sessionId = searchParams.get('session_id')
      
      // Get current session from URL hash
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user && sessionId) {
        // Convert anonymous session to user account
        await supabase.from('anonymous_sessions')
          .update({ 
            converted_at: new Date().toISOString(),
            user_id: session.user.id 
          })
          .eq('id', sessionId)
        
        // Create profile
        await supabase.from('profiles').upsert({
          id: session.user.id,
          email: session.user.email
        })
        
        // Migrate QR codes from anonymous session
        const { data: anonSession } = await supabase
          .from('anonymous_sessions')
          .select('session_data')
          .eq('id', sessionId)
          .single()
        
        if (anonSession?.session_data?.qr_codes) {
          for (const qr of anonSession.session_data.qr_codes) {
            await supabase.from('qr_codes').insert({
              user_id: session.user.id,
              type: qr.type,
              data: qr.data,
              styles: qr.styles
            })
          }
        }
      }
      
      navigate('/', { replace: true })
    }
    
    handleAuth()
  }, [])

  return <div>Setting up your account...</div>
}
```

### 6. Update App.tsx - Add Email Capture After Download
```tsx
// Add state
const [showEmailCapture, setShowEmailCapture] = useState(false)
const [lastDownloadedQR, setLastDownloadedQR] = useState<any>(null)

// In handleDownload, after successful download
const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
  // ... existing download code ...
  
  // Track the QR data for email capture
  setLastDownloadedQR({
    type: qrType,
    data: formData,
    styles: {
      fgColor,
      bgColor,
      dotsStyle,
      cornersStyle,
      gradientEnabled,
      gradientColor1,
      gradientColor2,
      logo
    }
  })
  
  // Show email capture (if not logged in)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    setShowEmailCapture(true)
  }
}

// In JSX, add the modal
{showEmailCapture && lastDownloadedQR && (
  <EmailCapture
    qrData={lastDownloadedQR}
    onClose={() => setShowEmailCapture(false)}
    onSuccess={() => {
      setShowEmailCapture(false)
      setLastDownloadedQR(null)
    }}
  />
)}
```

### 7. Simple History View (`src/components/QRHistory.tsx`)
```tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { QRCode } from '../lib/supabase'

export function QRHistory() {
  const [codes, setCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false })

    setCodes(data || [])
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>
  
  if (codes.length === 0) {
    return <div>No saved QR codes yet.</div>
  }

  return (
    <div className="qr-history">
      <h3>Your QR Codes</h3>
      {codes.map((qr) => (
        <div key={qr.id} className="qr-history-item">
          <span>{qr.type}</span>
          <span>{new Date(qr.created_at).toLocaleDateString()}</span>
          <span>{qr.download_count} downloads</span>
        </div>
      ))}
    </div>
  )
}
```

---

## Setup Steps (When You're Ready)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - New project → name it `qr-studio`
   - Choose region (US East for you)

2. **Run SQL Setup**
   - Go to SQL Editor
   - Copy/paste the schema above
   - Run each section

3. **Get Credentials**
   - Settings → API
   - Copy `URL` and `anon public`
   - Add to `.env` file

4. **Enable Auth**
   - Authentication → Providers → Email
   - Enable "Confirm email" (sends magic link)
   - Optional: Enable Google OAuth

5. **Test Flow**
   - Download a QR code
   - Enter email in capture modal
   - Check email for magic link
   - Click link → account created with QR saved

---

## Future S3 Integration (when ready)

```typescript
// For analytics exports
const exportAnalytics = async () => {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('created_at', '2026-01-01')
  
  const csv = convertToCSV(events)
  
  // Upload to S3 via Supabase Storage
  await supabase.storage
    .from('analytics-exports')
    .upload(`exports/${Date.now()}.csv`, csv)
}
```

---

## Email Marketing Integration (Future)

When you're ready for emails:

1. **Option: Supabase + n8n**
   - Webhook on new user → n8n
   - n8n adds to Brevo/SendGrid
   - Trigger welcome sequence

2. **Option: Direct Brevo API**
   ```typescript
   // On user signup
   await fetch('https://api.brevo.com/v3/contacts', {
     method: 'POST',
     headers: { 'api-key': BREVO_API_KEY },
     body: JSON.stringify({
       email: user.email,
       listIds: [2], // QR Studio users
       attributes: { CREATED_AT: new Date().toISOString() }
     })
   })
   ```

---

Ready when you are. Share the Supabase URL + anon key and I'll wire it into the actual codebase.