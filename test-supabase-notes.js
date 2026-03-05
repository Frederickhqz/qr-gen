import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testNotes() {
  console.log('🧪 Testing Supabase Notes CRUD Operations\n')
  
  // 1. CREATE - Add a new note
  console.log('1️⃣  CREATE: Adding a new note...')
  const { data: newNote, error: createError } = await supabase
    .from('notes')
    .insert({
      title: 'Test Note',
      content: 'This is a test note created during integration testing.',
      tags: ['test', 'supabase', 'crud']
    })
    .select()
    .single()
  
  if (createError) {
    console.error('❌ Create failed:', createError.message)
    return
  }
  console.log('✅ Note created:', newNote)
  console.log('   ID:', newNote.id)
  console.log('   Title:', newNote.title)
  console.log('   Content:', newNote.content)
  console.log('   Tags:', newNote.tags)
  console.log('   Created at:', newNote.created_at)
  
  const noteId = newNote.id
  
  // 2. READ - Fetch the note
  console.log('\n2️⃣  READ: Fetching the note...')
  const { data: fetchedNote, error: readError } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single()
  
  if (readError) {
    console.error('❌ Read failed:', readError.message)
    return
  }
  console.log('✅ Note fetched:', fetchedNote)
  
  // 3. UPDATE - Modify the note
  console.log('\n3️⃣  UPDATE: Modifying the note...')
  const { data: updatedNote, error: updateError } = await supabase
    .from('notes')
    .update({
      title: 'Updated Test Note',
      content: 'This note has been updated with new content!',
      tags: ['test', 'supabase', 'crud', 'updated']
    })
    .eq('id', noteId)
    .select()
    .single()
  
  if (updateError) {
    console.error('❌ Update failed:', updateError.message)
    return
  }
  console.log('✅ Note updated:', updatedNote)
  console.log('   New title:', updatedNote.title)
  console.log('   New content:', updatedNote.content)
  console.log('   New tags:', updatedNote.tags)
  console.log('   Updated at:', updatedNote.updated_at)
  
  // 4. DELETE - Remove the note
  console.log('\n4️⃣  DELETE: Removing the note...')
  const { error: deleteError } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
  
  if (deleteError) {
    console.error('❌ Delete failed:', deleteError.message)
    return
  }
  console.log('✅ Note deleted successfully')
  
  // Verify deletion
  console.log('\n🔍 Verifying deletion...')
  const { data: deletedNote } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single()
  
  if (!deletedNote) {
    console.log('✅ Verification passed: Note no longer exists')
  } else {
    console.log('⚠️  Warning: Note still exists')
  }
  
  console.log('\n🎉 All CRUD operations completed successfully!')
}

testNotes().catch(console.error)
