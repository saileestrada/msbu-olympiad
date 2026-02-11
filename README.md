# MSBU March Olympiad — Performance Intelligence Dashboard

Interactive performance tracking tool for the March 2026 Olympiad competition. All data is entered manually and calculated client-side. Nothing is stored or transmitted.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Run `npm run build` (generates `dist/` folder)
3. Go to **Settings → Pages → Source → Deploy from a branch**
4. Select the `gh-pages` branch, or use the GitHub Actions workflow included below

### Automated Deploy (GitHub Actions)

Create `.github/workflows/deploy.yml` (already included in this repo):

```
On push to main → builds → deploys to GitHub Pages automatically
```

## How It Works

Counselors enter their own data:
- **Athlete Setup**: Name, PY Baseline, BU Median Floor, Current Day
- **Current Production**: Total BV, Heritage BV, PAF BV, Large Sale BV

The dashboard calculates:
- Training Weight (MAX of PY Baseline and BU Median)
- 110% Qualifying and 120% Championship targets
- Status badges, pace analysis, daily minimums
- Behavior-based projections from Training Log inputs
- Podium distance calculations

## Stack

- React 18
- Vite 5
- Zero external UI libraries
- Barlow Condensed + DM Sans (Google Fonts, loaded via CDN)
