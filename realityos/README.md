# RealityOS

RealityOS turns a photo or live camera capture into an understandable, actionable visual insight. Gemini analyzes the image on the server, while scan history and preferences stay local to the signed-in browser profile.

## Run locally

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`.
2. Install dependencies with `npm install`.
3. Start the frontend and backend together:

```bash
npm run dev
```

Open `http://localhost:5173`. The backend runs on `http://localhost:8787` and exposes `/api/health`, `/api/analyze`, and `/api/ask`.

For production, run `npm run build` followed by `npm run start`. Keep `.env` private; the Gemini key is intentionally server-only and is never bundled into the browser.

## Live features

- Gemini-powered image analysis and contextual Q&A
- Reality Lens modes that focus analysis on documents, products, places, or objects
- Translation Lens for menus, signs, labels, and notices
- Explicit translation targets for English, Hindi, Spanish, French, Japanese, and Arabic
- Real browser camera capture with front/back camera switching
- Hardware-aware camera torch control for supported mobile browsers
- Persistent local scan history with review state
- Voice questions through the browser speech-recognition API
- Read-aloud answers through the browser speech-synthesis API
- Live geolocation for one-tap directions to saved places
- Live weather, humidity, wind, and local-time context from the user’s location
- Installable offline-capable PWA shell with network-only AI requests
- Drag-and-drop and clipboard image capture for instant scans
- Live staged scan feedback while the vision engine is processing
- Screen scanning for analyzing anything visible on your desktop
- Live QR and barcode detection with copy/open actions when supported
- Immersive fullscreen Focus Lens mode for hands-free scanning
- Persistent action tasks created directly from scan recommendations
- Downloadable and shareable RealityOS snapshots
- Deadline reminders delivered through browser notifications
- Backend health status that updates every 30 seconds
- Live backend latency shown in the status bar
- Live Pulse dashboard card with AI response time, scan memory, action queue, and device capability signals
- Automatic local-state refresh so new scans and completed tasks appear without a page reload
- Attention Radar with live deadline countdowns, overdue highlighting, and a prioritized next action
- Offline Scan Queue that stores captures privately and retries them when the AI service returns
- Reality Stream timeline that merges scans, tasks, and queued captures with live deep links
- Persistent Focus Dock with a cross-tab 25-minute timer and completion notifications
- Suggested navigation actions open live nearby Maps results
- Detected deadlines can open prefilled Google Calendar events
- Local tasks, reminders, memory, privacy controls, and theme preferences
