# LinkedIn Growth Tool — AI-Powered Profile & Content Optimizer

An offline-first Next.js application designed to accelerate your LinkedIn growth. It leverages Google Gemini AI models to analyze profile metrics, optimize headlines and summaries, and write highly engaging post formats.

## Features

- **Profile Optimizer:** Audit headlines, about summaries, experience details, and track improvements over time with snapshot history.
- **Content Studio:** AI-powered post writer with hook optimization, tone matching, and direct LinkedIn publishing.
- **Post Calendar:** Schedule, queue, and publish posts to LinkedIn.
- **Analytics Tracker:** Log and chart weekly performance metrics (connections, impressions, profile views).
- **Growth Coach:** Conversational AI coach built to help refine your content strategy.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** CSS & TailwindCSS
- **Database:** SQLite (managed via Prisma ORM)
- **AI Engine:** Google Gemini API
- **Auth & API Integrations:** NextAuth.js & LinkedIn REST API (/rest/posts)

## Getting Started

1. Set up your `.env.local` variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXTAUTH_SECRET=random_secret_string
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   ```
2. Initialize database:
   ```bash
   npx prisma db push
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
