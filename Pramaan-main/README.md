# Pramaan — Evidence Intelligence Platform

> **Follow the money. Find the proof.**  
> An open-source audit intelligence platform that connects World Bank development funding, geotagged field photography, and ground-truth evidence in one auditable workspace.

---

## Overview

Pramaan (Sanskrit: *proof / evidence*) is a React-based evidence management dashboard built for development-sector auditors, field inspectors, and policy researchers. It aggregates real World Bank project data, links field media assets, detects evidence gaps, and generates audit-ready impact reports — all in a premium dark-mode interface.

---

## Features

| Feature | Description |
|---|---|
| 🔐 **Auth with persistence** | Login / Sign-up with role selection; session survives page refresh via `localStorage` |
| 📊 **Dashboard** | Funding KPIs, project summaries, live World Bank data |
| 📋 **Projects List** | Filterable/searchable registry of real World Bank India operations |
| 🔍 **Project Detail** | Evidence observations, gap analysis, media timeline, coverage metrics |
| 📸 **Evidence Wall** | Field photo browser linked to project locations and activities |
| 🗺️ **Geospatial Map** | Interactive Leaflet map (OpenStreetMap, free tiles) with clickable pins |
| 🧠 **Evidence Gap Detector** | AI-style audit gap flagging with severity and recommended actions |
| 📋 **Impact Story Generator** | Auto-generates audit-ready reports from project + media data |
| 🔔 **Notifications** | Slide-in audit alert panel |
| 🎯 **Live Demo Tour** | Guided walkthrough of all platform features |
| 🖱️ **Custom Cursor** | Premium micro-animated cursor |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 |
| Maps | Leaflet.js (OpenStreetMap tiles — no API key) |
| Icons | Lucide React |
| Data | World Bank Projects API + bundled JSON fallback |
| Media | Cloudinary (runtime-configurable, optional) |
| Auth persistence | `localStorage` |
| Deployment | Vercel (static SPA) |

---

## Project Structure

```
pramaan/
├── public/
├── src/
│   ├── components/          # 21 UI components
│   │   ├── Header.jsx       # Global search, notifications, profile
│   │   ├── Sidebar.jsx      # Navigation
│   │   ├── LoginView.jsx    # Sign-in / Sign-up / Success screens
│   │   ├── DashboardView.jsx
│   │   ├── ProjectsListView.jsx
│   │   ├── ProjectDetailView.jsx
│   │   ├── EvidenceWallView.jsx
│   │   ├── EvidenceMapView.jsx
│   │   ├── ProjectMap.jsx   # Leaflet map wrapper
│   │   ├── NotificationPanel.jsx
│   │   ├── ProfileDropdown.jsx
│   │   ├── ImpactStoryModal.jsx
│   │   ├── EvidenceGapCard.jsx
│   │   ├── LiveDemoTour.jsx
│   │   └── ...
│   ├── services/
│   │   ├── worldBankService.js      # World Bank Projects API
│   │   ├── cloudinaryService.js     # Cloudinary media layer
│   │   ├── evidenceService.js       # Gap detection, observations, impact stories
│   │   └── governmentDataService.js # data.gov.in integration
│   ├── config/
│   │   └── dataSources.js           # API endpoint registry
│   ├── data/
│   │   └── real_world_bank_projects.json  # Bundled fallback dataset
│   ├── types/
│   │   └── media.js
│   ├── App.jsx              # Root: routing, auth, data orchestration
│   ├── main.jsx             # ReactDOM entry point
│   └── index.css            # Global styles + animations
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Environment Variables

No environment variables are **required** to run the project — the app works fully out of the box with bundled data and public APIs.

The variables below are **optional** and unlock live API features:

| Variable | Visibility | Used In | Purpose |
|---|---|---|---|
| `VITE_DATA_GOV_API_KEY` | Secret | `governmentDataService.js` | Enables live queries to `api.data.gov.in` for India government scheme data. Falls back to bundled curated records if absent. |
| `VITE_CLOUDINARY_CLOUD_NAME` | Public | `cloudinaryService.js` | Pre-configures the Cloudinary media cloud name at build time instead of requiring runtime input. |
| `VITE_CLOUDINARY_API_KEY` | **Secret** | `cloudinaryService.js` | Authenticates signed Cloudinary asset requests. Store only in server-side environments; do **not** expose in client builds. |

> All `VITE_` prefixed variables are inlined into the client bundle by Vite.  
> **Never commit `.env` files.** Add secrets to Vercel's Environment Variables dashboard instead.

### `.env.local` example (not committed)

```env
VITE_DATA_GOV_API_KEY=your_data_gov_in_key_here
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
# VITE_CLOUDINARY_API_KEY — use Vercel env vars only, not client .env
```

---

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/pramaan.git
cd pramaan

# 2. Install dependencies
npm install

# 3. (Optional) Set environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start the dev server
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api/worldbank` → `https://search.worldbank.org/api/v2/projects` to avoid CORS. The app falls back to the bundled JSON dataset if the live API is unavailable.

---

## Build & Deployment

### Production build

```bash
npm run build
# Output → dist/
```

### Vercel deployment

1. Push to GitHub/GitLab
2. Import the repo in [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite — no config needed
4. Add optional environment variables in **Project → Settings → Environment Variables**
5. Deploy

> The World Bank API proxy (`/api/worldbank`) runs via Vite's dev proxy locally.  
> For production, add a `vercel.json` with a rewrite rule if live World Bank API calls are needed (the bundled fallback dataset covers all current features without it).

### `vercel.json` (optional, for API proxy in production)

```json
{
  "rewrites": [
    {
      "source": "/api/worldbank(.*)",
      "destination": "https://search.worldbank.org/api/v2/projects$1"
    }
  ]
}
```

---

## Main Routes / Views

| View key | Component | Description |
|---|---|---|
| `home` | `DashboardView` | KPI metrics, funding overview, top projects |
| `projects` | `ProjectsListView` | Searchable/filterable World Bank project registry |
| `project_detail` | `ProjectDetailView` | Per-project evidence, gaps, media, observations |
| `evidence` | `EvidenceWallView` | Field photo/media browser |
| `map` | `EvidenceMapView` | Geospatial Leaflet map with clickable location pins |
| `reports` | `EvidenceGapCard` | Audit gap detector & compliance dashboard |

Navigation is state-driven (no URL router) — all views render within `App.jsx` based on `currentView` state.

---

## Data Sources

| Source | Type | Auth Required |
|---|---|---|
| [World Bank Projects API](https://search.worldbank.org/api/v2/projects) | Public REST API | No |
| [data.gov.in](https://api.data.gov.in/) | Public REST API | Optional API key |
| [OpenStreetMap](https://www.openstreetmap.org/) | Map tiles via Leaflet | No |
| Cloudinary | Media CDN | Optional cloud name + key |
| Bundled JSON (`real_world_bank_projects.json`) | Static fallback | No |

---

## License

MIT © Pramaan Contributors
