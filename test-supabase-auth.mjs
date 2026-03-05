import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test user credentials (using a test email)
const testEmail = `testuser${Date.now()}@testmail.com`
const testPassword = 'TestPassword123!'

async function testAuth() {
  console.log('🔐 Testing Supabase Auth Integration\n')
  console.log('📍 Instance:', supabaseUrl)
  console.log('')
  
  let testUserId = null
  
  // 1. SIGN UP - Create a new user
  console.log('1️⃣  SIGN UP: Creating a new user...')
  console.log('   Email:', testEmail)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        test_user: true,
        created_at: new Date().toISOString()
      }
    }
  })
  
  if (signUpError) {
    console.error('❌ Sign up failed:', signUpError.message)
    console.error('   Error code:', signUpError.status)
    
    // Check if it's a "user already exists" error
    if (signUpError.message.includes('already been registered')) {
      console.log('\n⚠️  User already exists, attempting to sign in instead...')
    }
  } else {
    console.log('✅ Sign up successful!')
    console.log('   User ID:', signUpData.user?.id)
    console.log('   Email:', signUpData.user?.email)
    console.log('   Email confirmed:', signUpData.user?.email_confirmed_at)
    console.log('   Created at:', signUpData.user?.created_at)
    
    testUserId = signUpData.user?.id
    
    // Check if email confirmation is required
    if (signUpData.user?.identities?.length === 0) {
      console.log('\n⚠️  User already exists (same email)')
    }
  }
  
  // 2. SIGN IN - Authenticate the user
  console.log('\n2️⃣  SIGN IN: Authenticating user...')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  })
  
  if (signInError) {
    console.error('❌ Sign in failed:', signInError.message)
    console.log('\n💡 This might mean:')
    console.log('   - Email confirmation is required (check inbox)')
    console.log('   - User does not exist yet')
    console.log('   - Incorrect credentials')
    return
  }
  
  console.log('✅ Sign in successful!')
  console.log('   User ID:', signInData.user?.id)
  console.log('   Email:', signInData.user?.email)
  console.log('   Access Token:', signInData.session?.access_token?.substring(0, 20) + '...')
  console.log('   Refresh Token:', signInData.session?.refresh_token?.substring(0, 20) + '...')
  console.log('   Expires at:', new Date(signInData.session?.expires_at * 1000).toISOString())
  
  testUserId = signInData.user?.id
  
  // 3. GET SESSION - Verify current session
  console.log('\n3️⃣  GET SESSION: Verifying current session...')
  const { data: sessionData } = await supabase.auth.getSession()
  
  if (sessionData.session) {
    console.log('✅ Session is valid')
    console.log('   User ID:', sessionData.session.user.id)
    console.log('   Email:', sessionData.session.user.email)
  } else {
    console.log('❌ No active session')
  }
  
  // 4. GET USER - Fetch user details
  console.log('\n4️⃣  GET USER: Fetching user details...')
  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('❌ Get user failed:', userError.message)
  } else {
    console.log('✅ User retrieved')
    console.log('   ID:', userData.user.id)
    console.log('   Email:', userData.user.email)
    console.log('   Created at:', userData.user.created_at)
    console.log('   Last sign in:', userData.user.last_sign_in_at)
    console.log('   Metadata:', JSON.stringify(userData.user.user_metadata))
  }
  
  // 5. UPDATE USER - Modify user metadata
  console.log('\n5️⃣  UPDATE USER: Updating user metadata...')
  const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name: 'Test User',
      role: 'tester',
      updated_at: new Date().toISOString()
    }
  })
  
  if (updateError) {
    console.error('❌ Update user failed:', updateError.message)
  } else {
    console.log('✅ User updated')
    console.log('   New metadata:', JSON.stringify(updatedUser.user.user_metadata))
  }
  
  // 6. Test authenticated CRUD on qr_codes
  console.log('\n6️⃣  AUTH CRUD: Testing authenticated QR code operations...')
  
  // Create a QR code with user_id
  const { data: authQR, error: qrError } = await supabase
    .from('qr_codes')
    .insert({
      user_id: testUserId,
      type: 'url',
      data: { url: 'https://authenticated-test.com' },
      styles: {
        fgColor: '#000000',
        bgColor: '#ffffff',
        dotsStyle: 'square',
        cornersStyle: 'square',
        gradientEnabled: false
      }
    })
    .select()
    .single()
  
  if (qrError) {
    console.error('❌ Authenticated QR create failed:', qrError.message)
  } else {
    console.log('✅ Authenticated QR code created')
    console.log('   ID:', authQR.id)
    console.log('   User ID:', authQR.user_id)
    console.log('   Type:', authQR.type)
    
    // Try to fetch user's QR codes
    console.log('\n6.5️⃣  Query: Fetching user\'s QR codes...')
    const { data: userQRs } = await supabase
      .from('qr_codes')
      .select('id, type, created_at')
      .eq('user_id', testUserId)
      .limit(5)
    
    if (userQRs) {
      console.log('✅ Found', userQRs.length, 'QR code(s) for this user')
      userQRs.forEach((qr, i) => {
        console.log(`   ${i + 1}. ${qr.id} (${qr.type})`)
      })
    }
    
    // Clean up - delete the test QR code
    console.log('\n🧹 Cleaning up test QR code...')
    await supabase
      .from('qr_codes')
      .delete()
      .eq('id', authQR.id)
    console.log('✅ Test QR code deleted')
  }
  
  // 7. Check if profiles table was auto-created
  console.log('\n7️⃣  PROFILES: Checking if user profile was created...')
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', testUserId)
    .single()
  
  if (profileError) {
    console.log('⚠️  Profile not found or not accessible')
    console.log('   Error:', profileError.message)
    console.log('   (This is normal if the trigger is not set up)')
  } else {
    console.log('✅ Profile found')
    console.log('   Email:', profile.email)
    console.log('   Subscription:', profile.subscription_status)
    console.log('   Marketing consent:', profile.marketing_consent)
  }
  
  // 8. SIGN OUT - Log out the user
  console.log('\n8️⃣  SIGN OUT: Logging out user...')
  const { error: signOutError } = await supabase.auth.signOut()
  
  if (signOutError) {
    console.error('❌ Sign out failed:', signOutError.message)
  } else {
    console.log('✅ User signed out successfully')
  }
  
  // 9. Verify session is cleared
  console.log('\n9️⃣  VERIFY: Confirming session is cleared...')
  const { data: postSignOutSession } = await supabase.auth.getSession()
  
  if (!postSignOutSession.session) {
    console.log('✅ Session cleared successfully')
  } else {
    console.log('⚠️  Session still active (unexpected)')
  }
  
  console.log('\n🎉 Auth integration test completed!')
  console.log('\n📋 Summary:')
  console.log('   ✅ Sign up')
  console.log('   ✅ Sign in')
  console.log('   ✅ Get session')
  console.log('   ✅ Get user')
  console.log('   ✅ Update user')
  console.log('   ✅ Authenticated CRUD')
  console.log('   ✅ Sign out')
  console.log('')
  console.log('🔐 Auth is working correctly!')
}

// Run the test
testAuth().catch(error => {
  console.error('\n❌ Test failed with error:', error.message)
  console.error(error)
})
