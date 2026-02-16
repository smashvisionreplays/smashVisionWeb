# SmashVision Web - CLAUDE.md

## Company Overview

**SmashVision** installs cameras in padel club courts that record users' games. Recordings are uploaded to Cloudflare Stream, and users access them through this website to watch their games and create clips. The company operates three interconnected projects:

1. **smashVisionWeb** (this project) - React frontend website
2. **api** (`../api`) - Express.js REST API + WebSocket server
3. **smashVision-club-server** (`../../smashVision-club-server`) - On-premise server at each club that manages camera-to-YouTube live streaming via Docker/FFmpeg

## Tech Stack

- **Framework**: React 18 + Vite 6
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 3 + Ant Design 5 + Flowbite React
- **Auth**: Clerk (`@clerk/clerk-react`)
- **Video**: Cloudflare Stream (`@cloudflare/stream-react`)
- **HTTP**: Axios
- **State**: React Context API (LanguageContext, WebSocketContext)
- **i18n**: Custom LanguageContext with EN/ES translations
- **Date libs**: dayjs, date-fns, MUI date pickers

## Project Structure

```
smashVisionWeb/
├── src/
│   ├── main.jsx              # Entry point (ClerkProvider, BrowserRouter, LanguageProvider)
│   ├── Index.jsx              # Route definitions + layout (NavBar, Footer, notifications)
│   ├── App.jsx                # App wrapper
│   ├── pages/                 # Page components
│   │   ├── Home.jsx           # Landing - game search (club > court > date > time)
│   │   ├── Login.jsx          # Clerk auth (email/password + Google OAuth)
│   │   ├── VideoView.jsx      # Video player + clip creation
│   │   ├── ClipView.jsx       # Clip playback + download (protected)
│   │   ├── Dashboard.jsx      # User dashboard - clips/videos/lives/stats (protected)
│   │   ├── Lives.jsx          # Live stream viewer
│   │   └── Tournaments.jsx    # Tournaments page
│   ├── contexts/
│   │   ├── LanguageContext.jsx # i18n (EN/ES), auto-detects from location
│   │   └── WebSocketContext.jsx# Real-time updates (camera status changes)
│   ├── controllers/           # API call functions (axios)
│   │   ├── serverController.js # Main API calls (clubs, videos, clips, cameras)
│   │   ├── cloudflareController.js # Cloudflare Stream API (clips, downloads)
│   │   ├── userController.js  # User metadata
│   │   └── statisticsController.js
│   ├── scripts/utils.js       # Time conversion helpers
│   └── hooks/                 # Custom hooks
├── components/
│   ├── NavBarTW.jsx           # Top navigation
│   ├── Sidebar.jsx            # Dashboard sidebar
│   ├── Footer.jsx
│   ├── auth/ProtectedRoute.jsx# Route guard (Clerk isSignedIn)
│   ├── home/BlurredContainer.jsx # Game search form
│   ├── videoView/
│   │   ├── VideoPlayer.jsx    # Cloudflare Stream player wrapper
│   │   └── CreateClipBox.jsx  # Clip time selection + tagging
│   └── dashboard/
│       ├── DashboardContent.jsx
│       └── StatisticsContent.jsx
├── stylesheet/                # CSS files (index.css has Tailwind imports)
├── public/                    # Static assets
├── Dockerfile + docker-compose.yml + nginx.conf
└── .env                       # Environment variables
```

## Key Routes

| Route | Component | Protected | Purpose |
|-------|-----------|-----------|---------|
| `/` | Home | No | Game search form |
| `/login` | Login | No | Clerk authentication |
| `/dashboard` | Dashboard | Yes | User clips, videos, lives, stats |
| `/videoView` | VideoView | No | Video playback + clip creation |
| `/clipView` | ClipView | Yes | Clip download |
| `/lives` | Lives | No | Live streams |

## Core Workflow: Finding & Clipping a Video

1. User selects club > court > date > time on Home page
2. API returns matching video from DB (stored as Cloudflare Stream UIDs)
3. VideoView plays it via `<Stream>` component
4. User sets start/end time (5-60s) and selects a tag
5. API creates clip via Cloudflare Stream API (with watermark)
6. ClipView polls for processing status, then offers download

## API Integration

- **Base URL**: `VITE_API_URL` (https://api.smashvisionapp.com)
- **WebSocket**: `VITE_WS_URL` (wss://api.smashvisionapp.com/ws?token=...)
- **Auth**: Bearer tokens from Clerk `getToken()`
- Controllers in `src/controllers/` wrap all API calls

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Conventions

- Font: Poppins (Google Fonts)
- Background: `#05070B` (dark theme)
- Ant Design uses `theme.darkAlgorithm`
- Components use Tailwind utilities + some custom CSS
- Two user roles: `member` (regular user) and `club` (club admin)
- Bilingual: English/Spanish via LanguageContext `t()` function
