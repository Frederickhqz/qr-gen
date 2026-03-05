import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createNotesTable() {
  console.log('📋 Step 0: Creating notes table...\n')
  
  // Try to create the table using execute SQL (if available)
  try {
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: {
        sql: `
          create table public.notes (
            id uuid default gen_random_uuid() primary key,
            title text not null,
            content text,
            tags text[] default '{}',
            created_at timestamp with time zone default now(),
            updated_at timestamp with time zone default now()
          );
          
          create index idx_notes_created_at on public.notes(created_at desc);
          
          alter table public.notes enable row level security;
          
          create policy "Allow all operations on notes"
            on public.notes for all
            using (true)
            with check (true);
        `
      }
    })
    
    if (data) {
      console.log('✅ Table created via Edge Function')
      return true
    }
    if (error) {
      console.log('⚠️  Edge Function not available:', error.message)
    }
  } catch (e) {
    console.log('⚠️  Cannot create table programmatically')
  }
  
  console.log('\n❌ You need to create the notes table manually.')
  console.log('\n📝 Go to: https://bsovtayuxwnmbaslsjnz.supabase.co')
  console.log('   Then: SQL Editor → New Query → Paste and run this SQL:\n')
  console.log('--- SQL START ---')
  console.log(`
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_notes_created_at on public.notes(created_at desc);

alter table public.notes enable row level security;

create policy "Allow all operations on notes"
  on public.notes for all
  using (true)
  with check (true);
`)
  console.log('--- SQL END ---\n')
  return false
}

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
    if (createError.message.includes('Could not find the table')) {
      console.log('❌ Table does not exist yet!')
      const created = await createNotesTable()
      if (!created) {
        console.log('\n👉 Please create the table first, then run this script again.')
        return
      }
      console.log('\n🔄 Retrying CREATE operation...\n')
      // Retry after table creation
      const { data: retryNote, error: retryError } = await supabase
        .from('notes')
        .insert({
          title: 'Test Note',
          content: 'This is a test note created during integration testing.',
          tags: ['test', 'supabase', 'crud']
        })
        .select()
        .single()
      
      if (retryError) {
        console.error('❌ Create failed:', retryError.message)
        return
      }
      newNote = retryNote
    } else {
      console.error('❌ Create failed:', createError.message)
      return
    }
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
