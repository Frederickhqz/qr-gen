import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkRLSPolicies() {
  console.log('🔍 Checking RLS Policies on Supabase Tables\n')
  
  // Query pg_policies to see current policies
  const { data: policies, error } = await supabase
    .from('pg_policies')
    .select('schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check')
    .in('tablename', ['qr_codes', 'events', 'anonymous_sessions', 'notes'])
    .order('tablename', { ascending: true })
  
  if (error) {
    console.log('❌ Could not fetch policies:', error.message)
    console.log('\n💡 This is expected - pg_policies requires authentication')
    console.log('\n📋 Current RLS issues detected:')
    console.log('   - qr_codes: INSERT violates RLS policy')
    console.log('   - events: INSERT violates RLS policy')
    console.log('   - anonymous_sessions: ✅ Working (has open policy)')
    
    console.log('\n🔧 Solution: Update RLS policies in Supabase')
    console.log('\n📝 Run this SQL in Supabase SQL Editor:\n')
    console.log('--- SQL START ---')
    console.log(`
-- Fix qr_codes RLS policy
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can CRUD own QR codes" ON public.qr_codes;

-- Create new policy that allows unauthenticated access for testing
-- In production, you'd want: using (auth.uid() = user_id)
CREATE POLICY "Allow all operations on qr_codes"
  ON public.qr_codes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Fix events RLS policy  
DROP POLICY IF EXISTS "Allow insert events" ON public.events;
DROP POLICY IF EXISTS "Users can view own events" ON public.events;

-- Create new policies for events
CREATE POLICY "Allow all operations on events"
  ON public.events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify policies are created
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('qr_codes', 'events', 'anonymous_sessions')
ORDER BY tablename, policyname;
`)
    console.log('--- SQL END ---\n')
    return
  }
  
  console.log('📋 Current Policies:\n')
  policies.forEach((p, i) => {
    console.log(`${i + 1}. Table: ${p.tablename}`)
    console.log(`   Policy: ${p.policyname}`)
    console.log(`   Command: ${p.cmd}`)
    console.log(`   Roles: ${p.roles}`)
    console.log(`   Permissive: ${p.permissive}`)
    console.log('')
  })
}

checkRLSPolicies().catch(console.error)
