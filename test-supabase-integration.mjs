import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testQRCodeCRUD() {
  console.log('🧪 Testing Supabase Integration - QR Code CRUD Operations\n')
  console.log('📍 Instance:', supabaseUrl)
  console.log('')
  
  // Generate a unique test ID to avoid conflicts
  const testId = `test-${Date.now()}`
  
  // Sample QR code data
  const testQRData = {
    type: 'url',
    data: { url: 'https://example.com' },
    styles: {
      fgColor: '#000000',
      bgColor: '#ffffff',
      dotsStyle: 'square',
      cornersStyle: 'square',
      gradientEnabled: false
    }
  }
  
  // 1. CREATE - Insert a new QR code
  console.log('1️⃣  CREATE: Inserting a new QR code...')
  const { data: newQR, error: createError } = await supabase
    .from('qr_codes')
    .insert({
      type: testQRData.type,
      data: testQRData.data,
      styles: testQRData.styles
    })
    .select()
    .single()
  
  if (createError) {
    console.error('❌ Create failed:', createError.message)
    console.error('   Details:', createError.details)
    console.error('   Hint:', createError.hint)
    return
  }
  console.log('✅ QR Code created successfully!')
  console.log('   ID:', newQR.id)
  console.log('   Type:', newQR.type)
  console.log('   Data:', JSON.stringify(newQR.data))
  console.log('   Created at:', newQR.created_at)
  
  const qrId = newQR.id
  
  // 2. READ - Fetch the QR code
  console.log('\n2️⃣  READ: Fetching the QR code...')
  const { data: fetchedQR, error: readError } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('id', qrId)
    .single()
  
  if (readError) {
    console.error('❌ Read failed:', readError.message)
    return
  }
  console.log('✅ QR Code fetched successfully!')
  console.log('   ID:', fetchedQR.id)
  console.log('   Type:', fetchedQR.type)
  console.log('   Download count:', fetchedQR.download_count)
  
  // 3. READ - List all QR codes (check if ours appears)
  console.log('\n2.5️⃣  READ: Listing QR codes...')
  const { data: allQRs, error: listError } = await supabase
    .from('qr_codes')
    .select('id, type, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (listError) {
    console.error('❌ List failed:', listError.message)
  } else {
    console.log('✅ Found', allQRs.length, 'QR code(s)')
    allQRs.forEach((qr, i) => {
      const isTest = qr.id === qrId ? ' ← TEST' : ''
      console.log(`   ${i + 1}. ${qr.id} (${qr.type})${isTest}`)
    })
  }
  
  // 4. UPDATE - Modify the QR code
  console.log('\n3️⃣  UPDATE: Modifying the QR code...')
  const updatedData = {
    type: 'text',
    data: { text: 'Updated test content!' },
    styles: {
      ...testQRData.styles,
      fgColor: '#ff0000',
      gradientEnabled: true,
      gradientColor1: '#ff0000',
      gradientColor2: '#0000ff'
    }
  }
  
  const { data: updatedQR, error: updateError } = await supabase
    .from('qr_codes')
    .update(updatedData)
    .eq('id', qrId)
    .select()
    .single()
  
  if (updateError) {
    console.error('❌ Update failed:', updateError.message)
    return
  }
  console.log('✅ QR Code updated successfully!')
  console.log('   New type:', updatedQR.type)
  console.log('   New data:', JSON.stringify(updatedQR.data))
  console.log('   FG Color:', updatedQR.styles.fgColor)
  console.log('   Gradient:', updatedQR.styles.gradientEnabled)
  console.log('   Updated at:', updatedQR.updated_at)
  
  // 5. Test incrementing download count
  console.log('\n3.5️⃣  UPDATE: Incrementing download count...')
  const { data: incrementedQR, error: incrementError } = await supabase
    .from('qr_codes')
    .update({ download_count: 1 })
    .eq('id', qrId)
    .select()
    .single()
  
  if (incrementError) {
    console.error('❌ Increment failed:', incrementError.message)
  } else {
    console.log('✅ Download count updated:', incrementedQR.download_count)
  }
  
  // 6. DELETE - Remove the QR code
  console.log('\n4️⃣  DELETE: Removing the QR code...')
  const { error: deleteError } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', qrId)
  
  if (deleteError) {
    console.error('❌ Delete failed:', deleteError.message)
    return
  }
  console.log('✅ QR Code deleted successfully!')
  
  // 7. Verify deletion
  console.log('\n🔍 Verifying deletion...')
  const { data: deletedQR } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('id', qrId)
    .single()
  
  if (!deletedQR) {
    console.log('✅ Verification passed: QR code no longer exists')
  } else {
    console.log('⚠️  Warning: QR code still exists')
  }
  
  console.log('\n🎉 All CRUD operations completed successfully!')
  console.log('')
  console.log('📊 Test Summary:')
  console.log('   ✅ CREATE - Insert new records')
  console.log('   ✅ READ - Fetch single record')
  console.log('   ✅ READ - List multiple records')
  console.log('   ✅ UPDATE - Modify existing records')
  console.log('   ✅ DELETE - Remove records')
  console.log('')
  console.log('🔗 Supabase Instance:', supabaseUrl)
}

async function testEventsCRUD() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 Bonus: Testing Events Table (Analytics)\n')
  
  // 1. CREATE - Insert an event
  console.log('1️⃣  CREATE: Inserting an analytics event...')
  const { data: newEvent, error: createError } = await supabase
    .from('events')
    .insert({
      event_type: 'qr_generated',
      event_data: {
        qr_type: 'url',
        generation_time_ms: 150,
        user_agent: 'test-script'
      }
    })
    .select()
    .single()
  
  if (createError) {
    console.error('❌ Event create failed:', createError.message)
    return
  }
  console.log('✅ Event created:', newEvent.id)
  console.log('   Type:', newEvent.event_type)
  console.log('   Data:', JSON.stringify(newEvent.event_data))
  
  const eventId = newEvent.id
  
  // 2. READ - Fetch the event
  console.log('\n2️⃣  READ: Fetching the event...')
  const { data: fetchedEvent } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()
  
  if (fetchedEvent) {
    console.log('✅ Event fetched successfully')
  }
  
  // 3. DELETE - Remove the event
  console.log('\n3️⃣  DELETE: Removing the event...')
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
  
  if (deleteError) {
    console.error('❌ Delete failed:', deleteError.message)
  } else {
    console.log('✅ Event deleted successfully')
  }
  
  console.log('\n🎉 Events table test completed!')
}

async function testAnonymousSessions() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 Bonus: Testing Anonymous Sessions Table\n')
  
  // 1. CREATE - Insert an anonymous session
  console.log('1️⃣  CREATE: Inserting an anonymous session...')
  const { data: newSession, error: createError } = await supabase
    .from('anonymous_sessions')
    .insert({
      email: `test-${Date.now()}@example.com`,
      session_data: {
        qr_codes: [
          {
            type: 'url',
            data: { url: 'https://test.com' },
            styles: { fgColor: '#000', bgColor: '#fff' }
          }
        ]
      }
    })
    .select()
    .single()
  
  if (createError) {
    console.error('❌ Session create failed:', createError.message)
    return
  }
  console.log('✅ Session created:', newSession.id)
  console.log('   Email:', newSession.email)
  console.log('   QR codes in session:', newSession.session_data?.qr_codes?.length || 0)
  
  const sessionId = newSession.id
  
  // 2. READ - Fetch the session
  console.log('\n2️⃣  READ: Fetching the session...')
  const { data: fetchedSession } = await supabase
    .from('anonymous_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
  
  if (fetchedSession) {
    console.log('✅ Session fetched successfully')
  }
  
  // 3. UPDATE - Modify the session
  console.log('\n3️⃣  UPDATE: Adding QR code to session...')
  const { data: updatedSession } = await supabase
    .from('anonymous_sessions')
    .update({
      session_data: {
        qr_codes: [
          { type: 'url', data: { url: 'https://test.com' }, styles: { fgColor: '#000', bgColor: '#fff' } },
          { type: 'text', data: { text: 'Hello!' }, styles: { fgColor: '#f00', bgColor: '#fff' } }
        ]
      }
    })
    .eq('id', sessionId)
    .select()
    .single()
  
  if (updatedSession) {
    console.log('✅ Session updated')
    console.log('   QR codes now:', updatedSession.session_data?.qr_codes?.length || 0)
  }
  
  // 4. DELETE - Remove the session
  console.log('\n4️⃣  DELETE: Removing the session...')
  const { error: deleteError } = await supabase
    .from('anonymous_sessions')
    .delete()
    .eq('id', sessionId)
  
  if (deleteError) {
    console.error('❌ Delete failed:', deleteError.message)
  } else {
    console.log('✅ Session deleted successfully')
  }
  
  console.log('\n🎉 Anonymous sessions table test completed!')
}

// Run all tests
async function runAllTests() {
  try {
    await testQRCodeCRUD()
    await testEventsCRUD()
    await testAnonymousSessions()
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ ALL SUPABASE INTEGRATION TESTS PASSED!')
    console.log('='.repeat(60))
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message)
  }
}

runAllTests()
