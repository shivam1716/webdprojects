# InsightFlow AI — Frontend UI

A premium, light-theme SaaS UI for an AI-powered customer-insight platform.
Built with React (Vite), Tailwind CSS v4, React Router, and Lucide icons.

This is a **frontend-only** build: no backend, API, database, auth, or AI
logic is implemented. All data comes from `src/utils/placeholderData.js`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build
npm run preview   # preview the production build
npm run lint       # lint with oxlint
```

## Design system

Tokens live in `src/styles/globals.css` (Tailwind v4 `@theme` block):
canvas/surface colors, the `accent` blue, semantic colors (success, warning,
danger, violet), a radius scale, and three flat/raised/modal shadows. Type
pairs **Inter** (UI/body) with **JetBrains Mono** for data — numbers,
timestamps, and badges — echoing the Stripe/Linear-style dashboards this UI
is modeled on.

The recurring visual motif is a "signal line": raw, jagged data resolving
into a single clean point — used in the logo mark, the loading spinner, and
empty-state illustrations.

## Folder structure

```
src/
  components/
    ui/         Reusable primitives — Button, Card, Badge, Input, Modal, ...
    layout/     Sidebar, Navbar, PublicNavbar, PublicFooter
  layouts/      Route-level shells — DashboardLayout, AuthLayout, PublicLayout
  pages/        One file per route
  routes/       AppRoutes.jsx — all <Route> definitions
  hooks/        useDisclosure, useDebounce
  services/     Reserved for the future API layer (currently just a README)
  utils/        cn() class helper, placeholderData.js
  styles/       globals.css (Tailwind v4 theme + base layer)
```

## Pages

Landing · Login · Register · Dashboard · Projects · Upload · Analysis ·
Reports · AI Chat · Settings · 404 — all wired up in `src/routes/AppRoutes.jsx`.
Auth pages navigate straight to `/dashboard` on submit (no real auth yet).

## Next steps (not included)

- Wire `src/services/` up to a real API and replace `placeholderData.js` imports
- Add authentication/session handling and route guards
- Replace the visual-only chat and upload progress with real requests
