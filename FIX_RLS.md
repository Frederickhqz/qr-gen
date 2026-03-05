# Supabase RLS Policy Fix

## Problem
The `qr_codes` and `events` tables have Row Level Security (RLS) policies that prevent unauthenticated inserts. The current policies require `auth.uid() = user_id`, but we're using the anon key without authentication.

## Solution

Run this SQL in your **Supabase SQL Editor**:

```sql
-- ============================================================
-- Fix RLS Policies for QR Code Generator Testing
-- ============================================================

-- 1. Fix qr_codes table
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can CRUD own QR codes" ON public.qr_codes;

-- Create permissive policy for testing
-- In production, replace with: USING (auth.uid() = user_id)
CREATE POLICY "Allow all operations on qr_codes"
  ON public.qr_codes FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Fix events table
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow insert events" ON public.events;
DROP POLICY IF EXISTS "Users can view own events" ON public.events;

-- Create permissive policy for testing
CREATE POLICY "Allow all operations on events"
  ON public.events FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Verify the changes
SELECT 
  tablename, 
  policyname, 
  cmd as command,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('qr_codes', 'events', 'anonymous_sessions')
ORDER BY tablename, policyname;
```

## Production Security (After Testing)

Once testing is complete, restore secure policies:

```sql
-- Secure qr_codes policy (users can only access their own)
DROP POLICY IF EXISTS "Allow all operations on qr_codes" ON public.qr_codes;
CREATE POLICY "Users can CRUD own QR codes"
  ON public.qr_codes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Secure events policy
DROP POLICY IF EXISTS "Allow all operations on events" ON public.events;
CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Allow insert events"
  ON public.events FOR INSERT
  WITH CHECK (true);
```

## Test After Fix

Run: `node test-supabase-integration.mjs`

Expected output: All CRUD operations should pass ✅
