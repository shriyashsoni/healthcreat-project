# HealthRouter Chat - Professional Healthcare AI Assistant

A production-ready healthcare chat application that helps patients find the right medical specialist using AI-powered triage and routing.

**Status**: ✅ Fully Functional | 🚀 Production Ready

## Quick Start (5 Minutes)

### 1. Set Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
```

### 2. Create Database Tables
Run `scripts/001_create_schema.sql` in your Supabase SQL Editor

### 3. Start App
```bash
npm run dev
```

Visit `http://localhost:3000` and test!

---

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Complete setup guide
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database configuration
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Test all features
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md)** - What's new
- **[CHANGELOG.md](CHANGELOG.md)** - All changes

---

## Features

✨ **User Authentication** - Supabase OAuth2 login
💬 **AI Chat** - OpenAI-powered specialist recommendations
📊 **Chat History** - All conversations saved automatically
⭐ **Favorites** - Star important conversations
👤 **User Profiles** - Edit name and avatar
📱 **Responsive Design** - Works on all devices
🔒 **Secure** - Row Level Security, protected routes

---

## Technology Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Database**: Supabase PostgreSQL with RLS
- **AI**: OpenAI API (gpt-4o-mini)
- **Auth**: Supabase Auth (OAuth2)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

---

## Commands

```bash
npm run dev       # Start development
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run linting
```

---

## Getting Help

1. **Setup Issues**: See [QUICK_START.md](QUICK_START.md)
2. **Testing Issues**: See [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. **Database Issues**: See [DATABASE_SETUP.md](DATABASE_SETUP.md)
4. **Code Questions**: See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
5. **What Changed**: See [CHANGELOG.md](CHANGELOG.md)

---

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy!

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.

---

**Ready to get started?** 👉 [Read QUICK_START.md](QUICK_START.md)

Made with ❤️ using Next.js, Supabase, and OpenAI
