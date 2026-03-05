import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bsovtayuxwnmbaslsjnz.supabase.co'
const supabaseAnonKey = 'sb_publishable_8GrgIgj6MwvnqfTqIKJ3_g_UMbDtZ4X'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createNotesTable() {
  console.log('📋 Creating notes table...\n')
  
  // Create the notes table using raw SQL via RPC
  const { data, error } = await supabase.rpc('create_notes_table')
  
  if (error) {
    console.log('❌ RPC method not available, trying alternative approach...')
    console.log('Error:', error.message)
    console.log('\n⚠️  You need to create the notes table manually in Supabase SQL Editor:')
    console.log('\n--- SQL to run ---')
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
    console.log('--- End SQL ---\n')
    return false
  }
  
  console.log('✅ Table created:', data)
  return true
}

createNotesTable().catch(console.error)
