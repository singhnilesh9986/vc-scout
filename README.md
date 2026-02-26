# VC Scout: Intelligence & Sourcing Interface

A premium, high-density discovery platform for Venture Capitalists to source, analyze, and track high-growth companies. Built as part of the VC Sourcing Sourcing Assignment.

## 🚀 Key Features
- **Market Intelligence Discovery**: Advanced search and filtering of seed-stage companies.
- **Live AI Enrichment**: Real-time extraction of company summaries, key signals, and technical data using server-side scraping.
- **Signals Trail**: A visual timeline of company milestones (funding, hiring, product launches).
- **Persistent Pipeline**: "Save to List" and "Internal Notes" features powered by LocalStorage for session-wide persistence.
- **Power-User Export**: One-click CSV export of curated company lists.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Obsidian Theme)
- **State Management**: React Hooks + LocalStorage Persistence
- **Deployment**: Vercel

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/singhnilesh9986/vc-scout
   cd vc-scout-app

2. **Install dependencies**
    npm install

3. **Run Development Server**
    npm run dev
    Open http://localhost:3000 to view the app.

**Architecture Decisions**
Persistence Strategy: Used localStorage for Lists and Notes to ensure a fast, database-less MVP that survives browser refreshes.

UX/UI: Implemented a "Dark Mode First" obsidian aesthetic to mimic high-end financial terminals (Bloomberg/Harmonic).

Caching: AI Enrichment results are cached per company ID in storage to prevent redundant API calls.