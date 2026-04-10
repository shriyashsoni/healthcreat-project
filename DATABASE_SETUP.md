# Database Setup Instructions

## Overview
This application uses Supabase for authentication, user profiles, conversation history, and favorites tracking.

## 1. Create Tables in Supabase

Copy the SQL from `scripts/001_create_schema.sql` and run it in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Click "New Query"
4. Copy and paste the entire contents of `scripts/001_create_schema.sql`
5. Click "Run"

This will create the following tables:
- **profiles**: User profile information (name, email, avatar)
- **conversations**: Chat conversations with favorites flag
- **messages**: Individual messages in conversations
- **favorites**: Bookmarks for important conversations

## 2. Enable Row Level Security (RLS)

The SQL script automatically enables RLS on all tables. This ensures users can only access their own data.

## 3. Environment Variables

You need these environment variables set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

Get these values from:
- **SUPABASE_URL & ANON_KEY**: Supabase Dashboard → Project Settings → API
- **SERVICE_ROLE_KEY**: Supabase Dashboard → Project Settings → API (Service Role Secret)
- **OPENAI_API_KEY**: OpenAI Platform → API Keys

## 4. Features Enabled

Once the database is set up, the following features are available:

### User Profiles
- View and edit your profile at `/profile`
- Upload avatar URL
- Update full name

### Chat History
- All conversations are automatically saved to the database
- Access chat history from the sidebar
- Load previous conversations

### Favorites
- Star important conversations
- View favorite conversations at the top of the sidebar

### Multi-turn Conversations
- Start new chats or continue existing ones
- Full conversation history is saved
- Copy responses with the copy button

## 5. Troubleshooting

### "Unauthorized" Error
Make sure you're logged in and your Supabase credentials are correct.

### Messages Not Saving
Check that:
1. The tables exist in your Supabase database
2. Row Level Security policies are enabled
3. Your OPENAI_API_KEY is set

### 404 on Chat API
The API now uses OpenAI (gpt-4o-mini) instead of NVIDIA APIs. Make sure your OPENAI_API_KEY is set.

## Database Schema Reference

### profiles table
- `id` (UUID): User ID from auth.users
- `email` (TEXT): User email
- `full_name` (TEXT): User's full name
- `avatar_url` (TEXT): URL to user's avatar image
- `created_at` (TIMESTAMP): Profile creation date
- `updated_at` (TIMESTAMP): Last update date

### conversations table
- `id` (UUID): Unique conversation ID
- `user_id` (UUID): Owner of conversation
- `title` (TEXT): Auto-generated title from first message
- `is_favorite` (BOOLEAN): Whether conversation is marked as favorite
- `created_at` (TIMESTAMP): Conversation creation date
- `updated_at` (TIMESTAMP): Last message date

### messages table
- `id` (UUID): Unique message ID
- `conversation_id` (UUID): Which conversation this message belongs to
- `user_id` (UUID): Author of message
- `role` (TEXT): Either 'user' or 'assistant'
- `content` (TEXT): Full message content
- `created_at` (TIMESTAMP): Message timestamp

### favorites table
- `id` (UUID): Unique favorite record ID
- `user_id` (UUID): User who favorited
- `conversation_id` (UUID): Conversation that was favorited
- `created_at` (TIMESTAMP): When favorited
- Unique constraint: (user_id, conversation_id)
