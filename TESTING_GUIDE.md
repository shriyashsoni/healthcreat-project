# Testing Guide

## Pre-Test Checklist

Before testing, make sure you have:

- [ ] Set environment variables in `.env.local`
- [ ] Created database tables by running SQL in Supabase
- [ ] App is running locally with `npm run dev`
- [ ] You're logged in to Supabase

## Test Scenarios

### Test 1: Login & Profile Creation
**Goal**: Verify user authentication and profile auto-creation

**Steps**:
1. Go to `http://localhost:3000`
2. You should be redirected to `/login`
3. Click "Sign in with Google" (or email)
4. Complete the authentication
5. You should be redirected to `/chat`
6. Click your avatar in the sidebar → "View Profile"
7. Your email should be displayed

**Expected Result**: ✅ Profile page shows your email and name

**If it fails**:
- Check that Supabase auth is configured
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check browser console for errors

---

### Test 2: Send First Chat Message
**Goal**: Verify chat API works and message saves to database

**Steps**:
1. You should be on `/chat` page
2. Type in the message box: "I have a severe headache for 2 days"
3. Click Send
4. Wait for response (should come from OpenAI)
5. You should see:
   - Your message in blue bubble on right
   - Assistant response in white bubble on left
   - Loading animation while waiting

**Expected Result**: ✅ You get a medical specialist recommendation

**If it fails**:
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Check browser console for "Missing OPENAI_API_KEY" error
- Verify the API key is valid (not expired)
- Check network tab to see actual API error

**Common Error**: 
```
Error: Missing OPENAI_API_KEY in environment variables
```
**Fix**: Add `OPENAI_API_KEY=sk-...` to `.env.local` and restart dev server

---

### Test 3: Conversation Auto-Save
**Goal**: Verify messages are saved to database

**Steps**:
1. Send a message (from Test 2)
2. Check the sidebar - you should see a new conversation appear
3. The conversation title should start with the first part of your message
4. Close the browser completely
5. Come back to `http://localhost:3000`
6. Click on that conversation in the sidebar
7. Your previous messages should load

**Expected Result**: ✅ Messages persist after browser reload

**If it fails**:
- Messages might not be saving (check database)
- Check that tables were created: `profiles`, `conversations`, `messages`
- Verify Row Level Security policies exist
- Check browser console for database errors

**Debug**:
1. Open Supabase dashboard
2. Go to SQL Editor
3. Run: `SELECT COUNT(*) FROM conversations;`
4. Should show number > 0 if conversations exist

---

### Test 4: Sidebar Conversation List
**Goal**: Verify sidebar loads and displays conversation history

**Steps**:
1. Open `/chat` page
2. Look at the left sidebar
3. You should see:
   - "New Chat" button at top
   - "Favorites" section (empty if no favorites yet)
   - "Recent" section with your conversations
4. Click on an old conversation
5. Messages should load

**Expected Result**: ✅ Sidebar shows your conversation history

**If it fails**:
- Sidebar not loading: Check network tab for `/api/conversations` error
- No conversations showing: Verify conversations exist in database
- Click on conversation but messages don't load: Check `/api/conversations/[id]/messages` endpoint

---

### Test 5: Favorite Conversations
**Goal**: Verify favorite/star functionality

**Steps**:
1. Open any conversation
2. Look at the header - you should see a star icon
3. Click the star icon
4. Star should fill in (turn blue)
5. Go back to sidebar
6. Conversation should now appear in "Favorites" section at top
7. Click star again to unfavorite
8. Conversation moves back to "Recent"

**Expected Result**: ✅ Star toggles favorite status

**If it fails**:
- Star click does nothing: Check `/api/conversations/[id]/favorite` endpoint
- Favorite doesn't show in sidebar: Sidebar not refreshing - try page reload
- Error in console: Check database connection

---

### Test 6: User Profile Editing
**Goal**: Verify profile editing and update

**Steps**:
1. Click your avatar in the sidebar
2. Click "View Profile"
3. You should see your email and name
4. Change your name to something like "Test User"
5. Add an avatar URL: `https://i.pravatar.cc/150?img=1`
6. Click "Save Profile"
7. You should see success message
8. Go back to chat (click back button)
9. Click avatar again - name should be updated

**Expected Result**: ✅ Profile updates and persists

**If it fails**:
- Can't navigate to `/profile`: Authentication might be broken
- Save button does nothing: Check `/api/profile` PUT endpoint
- Changes don't persist: Check that database updates are working
- Error: "Failed to update profile" - Check database RLS policies

---

### Test 7: Continue Conversation
**Goal**: Verify multi-turn conversation works

**Steps**:
1. Open a conversation (old or new)
2. Send a message: "I have fever"
3. Wait for response
4. Assistant should ask clarifying questions
5. Send another message: "Fever is 101 Fahrenheit"
6. Continue for ~3 exchanges
7. After 3 user messages, assistant should give final recommendation
8. "Consultation complete" message should show
9. New Chat button should work

**Expected Result**: ✅ Multi-turn conversation works, consultation completes after 3 exchanges

**If it fails**:
- Messages not sending: Check OpenAI API error
- Recommendation not showing: Verify API is reaching OpenAI
- Chat doesn't complete: May need to adjust message counting logic

---

### Test 8: New Chat Button
**Goal**: Verify creating new conversation works

**Steps**:
1. Open `/chat`
2. Send a message
3. Wait for response
4. Click "New Chat" button in header
5. Chat should clear
6. Initial greeting message should appear
7. You should be able to send a new message
8. Old conversation should still be in sidebar

**Expected Result**: ✅ New Chat clears chat and creates fresh conversation

**If it fails**:
- Button does nothing: Check if it's in navigation
- Clear doesn't work: Check state management
- New conversation not created: Verify API call is working

---

### Test 9: Sign Out
**Goal**: Verify user can log out

**Steps**:
1. Click your avatar in sidebar
2. Click "Sign Out"
3. You should be redirected to `/login`
4. Try to go to `/chat` directly
5. You should be redirected back to `/login`

**Expected Result**: ✅ Sign out works and login wall enforces protection

**If it fails**:
- Sign out button doesn't work: Check `/auth/signout` endpoint
- Can still access `/chat` after logout: Middleware not protecting routes

---

## Database Verification

### Check if Tables Exist
In Supabase SQL Editor:
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';
```

Should show:
- `profiles`
- `conversations`
- `messages`
- `favorites`

### Check User Data
```sql
SELECT * FROM profiles WHERE id = 'your-user-id';
```

Replace `'your-user-id'` with your actual user ID from auth.

### Check Conversations
```sql
SELECT id, title, is_favorite, created_at 
FROM conversations 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;
```

### Check Messages
```sql
SELECT role, content, created_at 
FROM messages 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Browser Console Debugging

### Enable Debug Mode
Add to your browser console:
```javascript
// Watch all API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('[v0] Fetch:', args[0], args[1]);
  return originalFetch(...args).then(r => {
    console.log('[v0] Response:', r.status, r.statusText);
    return r;
  });
};
```

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Missing OPENAI_API_KEY` | API key not set | Add to `.env.local` |
| `Unauthorized` | Not logged in | Login first |
| `Failed to fetch conversations` | Database error | Check RLS policies |
| `Cannot read property 'id' of undefined` | User object missing | Check auth setup |
| `PGRST116` | Record not found | Profile may not exist yet |

---

## Performance Testing

### Check Load Times
Open DevTools → Network tab:
1. Load `/chat` page
2. Check:
   - Page load time: Should be < 2s
   - API call times: Should be < 1s each
   - Sidebar loading: Should be instant once data loads

### Check Database Performance
In Supabase:
1. Go to Database → Your Project
2. View table sizes
3. Check if indexes are being used

---

## Automated Test Checklist

Use this to verify all features work:

```
✓ Login successful
✓ Can send chat message
✓ Get OpenAI response
✓ Message saves to database
✓ Sidebar shows conversation
✓ Can load conversation history
✓ Can favorite a conversation
✓ Favorite appears in sidebar
✓ Can visit profile page
✓ Can edit profile
✓ Changes persist
✓ Can start new chat
✓ Can sign out
✓ Logged out users can't access /chat
```

---

## Support & Troubleshooting

### If Something Doesn't Work

1. **Check environment variables**: `.env.local` should have all required keys
2. **Check database**: Run SQL in Supabase to verify tables exist
3. **Check browser console**: Look for JavaScript errors
4. **Check network tab**: Look for API response errors
5. **Check Supabase logs**: Go to Supabase dashboard → Logs
6. **Restart dev server**: Sometimes helps with env changes
7. **Check auth status**: Open DevTools → Application → Cookies/LocalStorage

### Get More Details

Add this to see detailed logs:
```typescript
// In any component or API route
console.log('[v0] Debug info:', { 
  user: 'your-user-id',
  timestamp: new Date(),
  pathname: window.location.pathname 
});
```

---

## Next Steps After Testing

If all tests pass:
1. ✅ Features are working!
2. Push code to GitHub
3. Deploy to Vercel
4. Test in production
5. Gather user feedback
6. Iterate and improve

**Congratulations! Your app is ready to use!** 🚀
