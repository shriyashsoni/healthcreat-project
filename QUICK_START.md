# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Environment Variables
Create a `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

**Where to get these:**
- **Supabase**: Go to Settings → API → Copy the URL and keys
- **OpenAI**: Go to Platform → API Keys → Create new secret key

### Step 2: Create Database Tables
1. Open your Supabase project dashboard
2. Go to SQL Editor → New Query
3. Copy the entire content of `scripts/001_create_schema.sql`
4. Paste it into the query editor
5. Click "Run"

That's it! The script creates all 4 tables with security policies.

### Step 3: Run the App
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:3000`

## ✨ What You Can Do Now

### For Users
1. **Login**: Sign in with Google or email (Supabase Auth)
2. **Chat**: Describe symptoms and get specialist recommendations
3. **Save History**: All conversations are automatically saved
4. **View Profile**: Go to `/profile` to edit your name and avatar
5. **Favorite Chats**: Star important conversations in the sidebar
6. **Continue Later**: Close and reopen - your conversations are there

### For Developers
- All API routes are protected (authentication required)
- Database has Row Level Security - users can only see their own data
- Chat messages auto-save to database
- Sidebar loads real conversation history from database
- Easy to extend - add new features to existing API routes

## 🧪 Test It Out

1. **First Chat**:
   - Click "New Chat"
   - Type: "I have severe headache for 2 days"
   - Click Send
   - You should get a specialist recommendation

2. **View History**:
   - Check the sidebar - your conversation should appear
   - Click on it to reload
   - You should see your previous messages

3. **Star It**:
   - Click the star icon in the header
   - Refresh the page
   - It should now show in "Favorites" at the top of sidebar

4. **Edit Profile**:
   - Click your avatar in the sidebar
   - Click "View Profile"
   - Edit your name and avatar URL
   - Click "Save Profile"
   - Go back to chat and see your updated info

## 📱 Architecture Overview

```
Frontend (Next.js App Router)
  ├── src/app/chat/ → Chat interface with sidebar
  ├── src/app/profile/ → Profile editor
  ├── src/app/login/ → (existing) Auth page
  └── src/components/ → ChatSidebar component

Backend (Next.js API Routes)
  ├── /api/chat → Chat with OpenAI
  ├── /api/profile → User profile management
  ├── /api/conversations → List/create chats
  ├── /api/conversations/[id]/messages → Load history
  ├── /api/conversations/[id]/favorite → Toggle favorite
  └── /auth/signout → Sign out

Database (Supabase PostgreSQL)
  ├── profiles → User data
  ├── conversations → Chat sessions
  ├── messages → Individual messages
  └── favorites → Bookmarked conversations
```

## 🔐 Security

- **Row Level Security (RLS)**: Only see your own data
- **Protected Routes**: Chat/profile routes require login
- **API Authentication**: Server validates user before saving
- **OpenAI**: Uses official OpenAI API (not free tier if paid model used)

## 🐛 Troubleshooting

### "Unauthorized" Error
**Problem**: Getting 401 on chat API  
**Solution**: 
- Make sure you're logged in
- Check Supabase credentials in `.env.local`

### Chat Returns Error
**Problem**: "Missing OPENAI_API_KEY"  
**Solution**:
- Add OPENAI_API_KEY to `.env.local`
- Make sure key is valid from OpenAI

### No Sidebar or Chat History
**Problem**: Conversations not showing in sidebar  
**Solution**:
1. Check that tables were created (run SQL in Supabase)
2. Verify SUPABASE_SERVICE_ROLE_KEY is correct
3. Check browser console for errors

### Profile Shows "Loading" Forever
**Problem**: Profile page stuck loading  
**Solution**:
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check network tab for API errors
- Try logging out and back in

## 📚 Learn More

- **Full Setup**: See `DATABASE_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI API**: https://platform.openai.com/docs

## 🎯 Pro Tips

1. **Test Different Symptoms**: Try various health descriptions to see different specialist routing
2. **Use Copy Button**: Assistant responses have a copy button - useful for saving recommendations
3. **Check Favorites**: Mark important medical guidance as favorites for quick reference
4. **Update Profile**: A complete profile helps personalize the experience

## 🚀 Ready to Deploy?

Once everything works locally:

```bash
npm run build
npm start
```

Then deploy to Vercel:
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel Settings
4. Deploy!

For detailed deployment: https://nextjs.org/docs/deployment

---

**Need help?** Check the docs or look at the console errors - they're usually descriptive!
