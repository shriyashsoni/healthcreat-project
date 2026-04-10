#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('[v0] Setting up database schema...');

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('create_profiles_table', {});
    if (profilesError && !profilesError.message.includes('already exists')) {
      console.log('[v0] Creating profiles table...');
      const createProfilesSQL = `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE POLICY "Users can view own profile" ON profiles
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile" ON profiles
          FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can insert own profile" ON profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
      `;
    }

    // Create conversations table
    console.log('[v0] Creating conversations table...');
    const { error: conversationsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT DEFAULT 'New Conversation',
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE POLICY "Users can view own conversations" ON conversations
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can create conversations" ON conversations
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own conversations" ON conversations
        FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete own conversations" ON conversations
        FOR DELETE USING (auth.uid() = user_id);
    `);

    // Create messages table
    console.log('[v0] Creating messages table...');
    const { error: messagesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE POLICY "Users can view own messages" ON messages
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can create messages" ON messages
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);

    // Create favorites table
    console.log('[v0] Creating favorites table...');
    const { error: favoritesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, conversation_id)
      );

      CREATE POLICY "Users can view own favorites" ON favorites
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can create favorites" ON favorites
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete favorites" ON favorites
        FOR DELETE USING (auth.uid() = user_id);
    `);

    console.log('[v0] Database schema setup completed!');
  } catch (error) {
    console.error('[v0] Database setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
