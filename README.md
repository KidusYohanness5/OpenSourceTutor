# OpenSourceTutor 🎹🎵

AI-powered music theory tutor for jazz harmony and sight-reading, built to democratize music education for schools with limited arts funding.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-green)
![Gemini](https://img.shields.io/badge/AI-Gemini-purple)

## 🌟 Features

### ✅ Implemented (Phase 1 & 2)

- **🎹 Interactive Practice Room**
  - Virtual piano with audio playback (C4-G5 range)
  - Web MIDI API support for physical keyboards
  - Real-time note recording during practice sessions
  - Keyboard shortcuts (Q-] keys with number row for sharps)

- **🤖 AI-Powered Feedback**
  - Gemini AI harmony analysis
  - Blue note detection
  - Constructive suggestions for improvement
  - Score and accuracy calculation

- **👤 User Authentication**
  - Firebase authentication (email/password)
  - Protected routes
  - Password reset functionality
  - Secure session management

- **📊 Progress Tracking**
  - Practice session history
  - XP and leveling system
  - Skill-based progress (blue notes, harmony, progressions)
  - Achievement system with unlockable badges
  - Daily practice streaks

- **💾 Database Management**
  - PostgreSQL with Supabase
  - Session recording and playback
  - User progress persistence
  - Achievement tracking

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Web MIDI API
- Web Audio API

**Backend:**
- Next.js API Routes
- PostgreSQL (Supabase)
- Firebase Authentication
- Vercel Serverless Functions

**AI/ML:**
- Google Gemini API (gemini-pro)
- Custom prompt engineering for music theory

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier)
- Supabase account (free tier)
- Google AI Studio account for Gemini API (free tier)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/opensourcetutor.git
   cd opensourcetutor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials in `.env.local`:
   - Firebase config (from Firebase Console)
   - Supabase database URLs (from Supabase Dashboard)
   - Gemini API key (from Google AI Studio)

4. **Set up the database**
   - Go to Supabase Dashboard → SQL Editor
   - Run `database_schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Navigate to http://localhost:3000
   - Sign up for an account
   - Start practicing!

For detailed setup instructions, see [SETUP.md](SETUP.md)

## 🎮 How to Use

### Practice Room

1. **Navigate to Practice** (http://localhost:3000/practice)
2. **Choose input method:**
   - Virtual Piano: Click on keys or use keyboard shortcuts
   - MIDI Keyboard: Connect your USB MIDI keyboard
3. **Select session type:**
   - Jazz Harmony
   - Blue Notes
   - Chord Progressions
4. **Start Practice** and play some notes
5. **Stop & Analyze** to get AI feedback

### Keyboard Shortcuts (Virtual Piano)

**White keys:** Q W E R T Y U I O P [ ]  
**Black keys:** 2 3 5 6 7 9 0 =

Maps to: C4 C# D D# E F F# G G# A A# B C5 C# D5 D# E5 F5 F# G5

## 📁 Project Structure

```
opensourcetutor/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── practice/        # Practice session endpoints
│   │   └── progress/        # Progress tracking endpoints
│   ├── auth/                # Auth pages
│   ├── dashboard/           # User dashboard
│   ├── practice/            # Practice room
│   └── test-ai/             # AI testing page
├── components/              # React components
│   ├── Navigation.tsx       # Main navigation
│   ├── Piano.tsx            # Virtual piano
│   └── ProtectedRoute.tsx   # Route protection
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── hooks/                   # Custom React hooks
│   └── useMIDI.ts           # Web MIDI API hook
├── lib/                     # Utility libraries
│   ├── db.ts                # Database connection
│   ├── db-utils.ts          # Database helper functions
│   ├── firebase.ts          # Firebase config
│   └── gemini.ts            # Gemini AI integration
├── types/                   # TypeScript type definitions
│   └── database.ts          # Database types
└── public/                  # Static assets
```

## 🗄️ Database Schema

- **users** - User accounts and profiles
- **practice_sessions** - Recording of practice sessions
- **user_progress** - XP, levels, and skill tracking
- **exercise_types** - Predefined exercise templates
- **exercise_history** - Detailed attempt records
- **achievements** - Achievement definitions
- **user_achievements** - Unlocked achievements
- **practice_streaks** - Daily practice streak tracking

## 🔑 Environment Variables

```env
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Supabase Database
POSTGRES_URL=              # Connection pooler (for Vercel)
DATABASE_URL=              # Direct connection (for local)

# Gemini AI
GEMINI_API_KEY=
```

## 🤝 Contributing

Contributions are welcome from:
- Developers (React, TypeScript, AI/ML)
- Music educators (curriculum, exercises)
- Designers (UI/UX improvements)
- Testers (bug reports, feature suggestions)

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Mission

To provide free, high-quality music education tools to schools that cannot afford dedicated music teachers or expensive software, helping students develop musical skills that enhance cognitive development, creativity, and cultural awareness.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Database hosted on [Supabase](https://supabase.com/)
- Authentication via [Firebase](https://firebase.google.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📧 Contact

Project Link: [https://github.com/KidusYohanness5/opensourcetutor](https://github.com/KidusYohanness5/opensourcetutor)

---

**Made with ❤️ for music education accessibility**
