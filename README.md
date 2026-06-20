# AI Event Concierge

A production-quality full-stack web application that uses AI to help corporate event planners find the perfect venue. Describe your event in plain language and receive an instant, structured venue proposal powered by Gemini AI, with all searches persisted in MongoDB.

## Features

- **AI-powered proposals** — Gemini 2.0 Flash analyzes your event description and recommends a real venue with cost estimates and justification
- **Persistent history** — every search is saved to MongoDB and survives page refreshes
- **Search & filter** — filter your proposal history by venue, location, or query text
- **Delete entries** — remove individual history items
- **One-click copy** — copy any proposal to your clipboard
- **Dark mode** — system-aware with manual toggle
- **Framer Motion animations** — smooth page transitions, skeleton loaders, hover effects
- **Fully responsive** — mobile, tablet, and desktop layouts
- **Accessible** — keyboard navigation, ARIA labels, focus states

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini 2.0 Flash |
| Fonts | Geist (Vercel) |
| Theming | next-themes |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Main dashboard page
│   ├── globals.css             # Global styles
│   └── api/
│       ├── generate/route.ts   # POST /api/generate
│       └── history/
│           ├── route.ts        # GET /api/history
│           └── [id]/route.ts   # DELETE /api/history/:id
├── components/
│   ├── SearchForm.tsx          # Event description textarea + submit
│   ├── ProposalCard.tsx        # AI result card with copy button
│   ├── HistoryCard.tsx         # Individual history entry card
│   ├── LoadingState.tsx        # Animated skeleton while AI generates
│   ├── ErrorToast.tsx          # Top-of-screen error notifications
│   └── ThemeToggle.tsx         # Light/dark mode switcher
├── lib/
│   ├── mongodb.ts              # Mongoose connection singleton
│   ├── gemini.ts               # Gemini API client + prompt
│   └── utils.ts                # cn(), formatDate(), truncate()
├── models/
│   └── EventProposal.ts        # Mongoose schema & model
└── types/
    └── event.ts                # Shared TypeScript interfaces
```

## Local Setup

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)

### 1. Clone & install

```bash
git clone <repo-url>
cd ai-event-concierge
npm install
```

### 2. Environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ai-event-concierge?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
```

**MongoDB Atlas setup:**
1. Create a free cluster at cloud.mongodb.com
2. Create a database user (Database Access tab)
3. Add `0.0.0.0/0` to IP allowlist (Network Access tab)
4. Click "Connect" → "Drivers" → copy the connection string

**Gemini API key:**
1. Go to aistudio.google.com
2. Click "Get API key" → "Create API key"
3. Copy the key

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Reference

### `POST /api/generate`

Generate a venue proposal for an event description.

**Request body:**
```json
{ "query": "A 10-person leadership retreat in the mountains for 3 days, budget $4,000" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "query": "...",
    "venueName": "Sundance Mountain Resort",
    "location": "Sundance, Utah",
    "estimatedCost": "$3,500 - $4,000 total",
    "justification": "...",
    "createdAt": "2026-06-20T..."
  }
}
```

### `GET /api/history`

Fetch all previous proposals, newest first.

### `DELETE /api/history/:id`

Delete a proposal by its MongoDB `_id`.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Then add your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

## License

MIT
