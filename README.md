# Mafia — Game Organiser

A web app for running the Mafia social deduction party game. The organiser holds the device throughout the entire game — players never touch it except briefly during role reveal.

## What it does

- **Setup** — Enter player names, toggle special roles (Detective, Doctor, Godfather), and assign roles automatically. Roles scale to player count (~1 Mafia per 4 players).
- **Role reveal** — The organiser passes the screen privately to each player one at a time. Mafia members see their allies on their role card.
- **Night phase** — Step-by-step organiser guide: Mafia picks a target, Doctor picks a protectee, Detective investigates. Players point silently; the organiser taps to record. Detective results are shown only after a deliberate reveal tap.
- **Day phase** — Announces who was killed (or saved). Runs a 3-minute discussion timer with pause/resume. Tracks votes with +/− tally; handles ties automatically.
- **Role secrecy** — Eliminated players' roles are never announced to the group during the game. The organiser sees the role privately; everyone sees the full reveal at Game Over.
- **Game Over** — Shows win condition, full faction reveal with alive/dead status. "Play Again" reshuffles roles with the same names; "New Game" goes back to setup.
- **Restart / End Game** — Available from role reveal onward via the top-right controls.

## Tech

- React + Vite (no backend, all state in memory)
- PWA manifest — installable as a home screen app on iOS and Android
- Responsive: single-column on mobile, sidebar + wide layout on desktop (≥768px)
- Safe area insets for iPhone notch/home indicator
- No external state libraries, no routing

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Deploy the `dist/` folder to any static host.

## Deploying

**Netlify Drop (no account needed):** drag the `dist/` folder onto [netlify.com/drop](https://netlify.com/drop).

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

## Game rules

See [GAME.md](./GAME.md) for the full rules, role descriptions, win conditions, and night phase flow.
