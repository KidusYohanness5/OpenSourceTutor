# OpenSourceTutor - Complete Setup Guide

This guide will walk you through setting up the OpenSourceTutor application from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Supabase Setup](#supabase-setup)
4. [Gemini AI Setup](#gemini-ai-setup)
5. [Project Setup](#project-setup)
6. [Environment Configuration](#environment-configuration)
7. [Database Initialization](#database-initialization)
8. [Running the Application](#running-the-application)
9. [Deployment (Vercel)](#deployment-vercel)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:

- **Node.js 18+** and **npm** installed
- A **Firebase account** (free tier is sufficient)
- A **Supabase account** (free tier is sufficient)
- A **Google AI Studio account** for Gemini API (free tier)
- **Git** installed
- A code editor (VS Code recommended)

---

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `opensourcetutor` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

### 3. Register Web App

1. In Firebase Console, click the **web icon** (</>)
2. Register app name: `opensourcetutor-web`
3. **Don't** enable Firebase Hosting
4. Click "Register app"
5. **Copy the configuration object** - you'll need these values:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New project"
3. Choose your organization (or create one)
4. Enter project details:
   - **Name:** opensourcetutor
   - **Database Password:** (choose a strong password - save it!)
   - **Region:** Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

### 2. Get Database URLs

1. Go to **Project Settings** → **Database**
2. Scroll to **Connection string**
3. Copy two URLs:
   - **Connection pooling** (Transaction mode) → This is your `POSTGRES_URL`
   - **Direct connection** (Session mode) → This is your `DATABASE_URL`
4. Replace `[YOUR-PASSWORD]` in both URLs with your database password

### 3. Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `database_schema.sql` from the project
4. Click "Run" or press Ctrl/Cmd + Enter
5. You should see "Success. No rows returned"

---

## Gemini AI Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Choose "Create API key in new project" (or select existing project)
4. **Copy the API key** - you'll need this
5. Keep it secure (don't commit to Git!)

### 2. Verify Model Access

The app uses the `gemini-pro` model. If you get errors:
- Try `gemini-1.5-pro-latest` instead
- Check available models at https://ai.google.dev/models/gemini

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/opensourcetutor.git
cd opensourcetutor
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js, React, TypeScript
- Firebase SDK
- Vercel Postgres SDK
- Google Generative AI
- Tailwind CSS
- And other dependencies

---

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Fill in Environment Variables

Open `.env.local` and add your credentials:

```env
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Database
POSTGRES_URL=your_supabase_connection_pooler_url
DATABASE_URL=your_supabase_direct_connection_url

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

**Important:**
- Use the **Connection pooling** URL for `POSTGRES_URL`
- Use the **Direct connection** URL for `DATABASE_URL`
- Never commit `.env.local` to Git!

---

## Database Initialization

### Verify Schema is Loaded

1. Go to Supabase Dashboard → **Table Editor**
2. You should see these tables:
   - users
   - practice_sessions
   - user_progress
   - exercise_types
   - exercise_history
   - achievements
   - user_achievements
   - practice_streaks

3. Click on **exercise_types** - should have 5 pre-seeded exercises
4. Click on **achievements** - should have 3 pre-seeded achievements

### If Tables Are Missing

Re-run the schema in SQL Editor:
1. Go to SQL Editor
2. Paste contents of `database_schema.sql`
3. Run the query

---

## Running the Application

### 1. Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

### 2. Test the Application

**Open http://localhost:3000**

#### Test Authentication:
1. Click "Login" in navigation
2. Click "Sign up" tab
3. Create an account (email + password)
4. You should be redirected to Dashboard

#### Test Practice Room:
1. Click "Practice" in navigation
2. Click "Start Practice"
3. Play some notes on the virtual piano (click or use Q-] keys)
4. Click "Stop & Analyze"
5. You should get AI feedback!

#### Test MIDI (if you have a MIDI keyboard):
1. Connect USB MIDI keyboard
2. Go to Practice page
3. Click "MIDI Keyboard" button
4. Allow MIDI access in browser
5. Start practice and play your keyboard

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/opensourcetutor.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add all variables from your `.env.local`
   - Make sure to add them for **Production**, **Preview**, and **Development**

6. Click "Deploy"

### 3. Post-Deployment

1. Wait for deployment to complete (~2-3 minutes)
2. Visit your deployed URL
3. Test authentication and practice room
4. Check Vercel logs if there are issues

### 4. Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Troubleshooting

### Common Issues

#### "Web MIDI not supported"
- **Solution:** Use Chrome, Edge, or Opera browsers
- Firefox and Safari don't support Web MIDI
- Use the Virtual Piano as an alternative

#### "No MIDI devices found"
- **Solution:** 
  - Check USB connection
  - Refresh the page
  - Try a different USB port
  - Use Virtual Piano instead

#### "Failed to sync user"
- **Solution:**
  - Verify database schema is loaded
  - Check Supabase connection in `.env.local`
  - Look at browser console for specific errors
  - Check Supabase logs in Dashboard

#### Firebase Auth Errors
- **Solution:**
  - Verify Email/Password is enabled in Firebase Console
  - Check Firebase config in `.env.local`
  - Try clearing browser cache/cookies
  - Check Firebase Console → Authentication → Users

#### AI Analysis Fails
- **Solution:**
  - Verify `GEMINI_API_KEY` is correct
  - Check you haven't exceeded free tier quota
  - Try changing model in `lib/gemini.ts` to `gemini-1.5-pro-latest`
  - Check browser console and terminal for errors

#### Database Connection Errors
- **Solution:**
  - Verify both `POSTGRES_URL` and `DATABASE_URL` are set
  - Check passwords are correct (no special characters escaped)
  - Restart dev server after changing `.env.local`
  - Check Supabase project is not paused (free tier pauses after inactivity)

#### Build Errors in Vercel
- **Solution:**
  - Make sure all environment variables are added in Vercel
  - Check build logs for specific errors
  - Verify `package.json` has all dependencies
  - Try deploying again (sometimes fails randomly)

### Getting Help

If you're still stuck:

1. **Check browser console** (F12 → Console tab)
2. **Check terminal** where `npm run dev` is running
3. **Check Vercel logs** if deployed
4. **Check Supabase logs** in Dashboard → Logs
5. **Open an issue** on GitHub with error details

---

## Next Steps

Once everything is working:

- [ ] Complete a practice session
- [ ] Check your progress in Dashboard
- [ ] Try different session types (Blue Notes, Chord Progressions)
- [ ] Test MIDI keyboard if available
- [ ] Explore the test AI page at `/test-ai`
- [ ] Customize the app for your needs!

---

## Development Workflow

### Making Changes

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make your changes
# ... edit files ...

# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Add my new feature"
git push origin feature/my-new-feature
```

### Deployment Workflow

Vercel automatically deploys when you push to `main`:

```bash
# Merge your feature
git checkout main
git merge feature/my-new-feature
git push origin main

# Vercel will auto-deploy
# Check deployment at vercel.com/dashboard
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

---

**Setup complete! Start building and enjoy making music education accessible! 🎹🎵**