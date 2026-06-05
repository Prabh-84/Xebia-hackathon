# Nandan — Frontend Tasks
### GreenOps AI Dashboard · Hackathon

---

## Stack
React · Vite · Chart.js · Axios · React Router DOM → deployed on **Vercel**

---

## File Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   ├── ui/
│   │   │   ├── KPICard.jsx
│   │   │   ├── GreenScoreBadge.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── BudgetBar.jsx
│   │   │   ├── StatDelta.jsx
│   │   │   └── Skeleton.jsx
│   │   └── charts/
│   │       ├── EmissionsChart.jsx
│   │       ├── ForecastChart.jsx
│   │       └── CostCarbonChart.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Forecast.jsx
│   │   ├── Recommendations.jsx
│   │   └── Projects.jsx
│   ├── services/
│   │   └── api.js            ← single source for all HTTP calls
│   ├── hooks/
│   │   └── useFetch.js
│   ├── styles/
│   │   ├── globals.css       ← variables, reset, font import
│   │   └── chartTheme.js     ← Chart.js defaults
│   ├── App.jsx
│   └── main.jsx
├── .env                      ← VITE_API_URL only
├── .env.example
└── vite.config.js
```

---

## Hour 1 — Scaffold & Shell
**Goal:** App boots, routes work, layout renders.

- [x] `N1.1` `npm create vite@latest frontend -- --template react`
- [x] `N1.2` Install: `react-router-dom axios react-chartjs-2 chart.js`
- [x] `N1.3` Write `globals.css` — paste the design tokens below, font import, box-sizing reset
- [x] `N1.4` `Sidebar.jsx` — logo mark + 4 nav links with active highlight
- [x] `N1.5` `TopBar.jsx` — current page title (left) + username from localStorage (right)
- [x] `N1.6` `App.jsx` — layout wrapper (`<Sidebar />` + `<main>`) wired to React Router
- [x] `N1.7` `services/api.js` — Axios instance, baseURL from env, JWT interceptor, helpers for `/register`, `/login`, `/dashboard`, `/usage`, `/carbon`, `/forecast`, `/recommendations`, `/green-score`
- [x] `N1.8` `hooks/useFetch.js` — `useFetch(fn)` returns `{ data, loading, error, refetch }`
---

## Hour 2 — Dashboard Page
**Goal:** Landing page fully visible, data flowing.

- [x] `N2.1` `KPICard.jsx` — props: `label`, `value`, `unit`, `delta` (% change, positive/negative colored)
- [x] `N2.2` `GreenScoreBadge.jsx` — props: `score` (A–F); pill with color + label from the score map
- [x] `N2.3` `Skeleton.jsx` — CSS-only pulsing placeholder, used while any fetch is in-flight
- [x] `N2.4` `EmissionsChart.jsx` — Line chart, monthly CO2e, data from `GET /dashboard`
- [x] `N2.5` `Dashboard.jsx` layout:
  - Row 1: 4 `KPICard`s — Total Carbon (kg), Total Cost ($), Avg Green Score, Active Projects
  - Row 2: `EmissionsChart` (left 65%) + Green Score summary panel (right 35%)
- [x] `N2.6` Show `Skeleton` while loading; show inline error text if fetch fails (no modal)
---

## Hour 3 — Remaining Pages
**Goal:** All available pages connected to live APIs.

- [x] `N3.1` `ForecastChart.jsx` — solid line = historical, dashed line = predicted, shaded band = range; `GET /forecast`
- [x] `N3.2` `Forecast.jsx` — chart + one-line summary: *"Emissions projected to reach X kg by [month]"*
- [x] `N3.3` `RecommendationCard.jsx` — props: `text`, `status`, `carbonSaving`, `costSaving`; two small saving pills at bottom
- [x] `N3.4` `Recommendations.jsx` — card grid (2-col desktop, 1-col mobile); `GET /recommendations`
- [x] `N3.5` `BudgetBar.jsx` — horizontal bar showing budget / current / forecast as segments; status chip Safe · Warning · Exceeded
- [x] `N3.6` `CostCarbonChart.jsx` — grouped bar per project, dual axis (cost USD + CO2e kg)
- [x] `N3.7` `Projects.jsx` — table: project name, provider, region, CO2e, cost, green score badge
- [x] `N3.8` Skip `Copilot.jsx` until a backend endpoint exists; do not call `/copilot`
---

## Hour 4 — Polish & Deploy
**Goal:** Live URL, zero broken states.

- [x] `N4.1` Error state on every page — one line of red text + a "Retry" button that calls `refetch()`
- [x] `N4.2` Empty state — small icon + text when arrays come back empty
- [x] `N4.3` Mobile layout — sidebar becomes a bottom tab bar below 768px
- [x] `N4.4` Page fade-in on route change — 150ms CSS opacity transition, no library
- [ ] `N4.5` Add `VITE_API_URL` to Vercel project environment variables
- [ ] `N4.6` `vercel --prod`
- [ ] `N4.7` Click through every page on live URL, fix any broken calls
---

## Design System

### Tokens — paste into `globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');

:root {
  /* surfaces */
  --bg-base:      #080e0b;
  --bg-card:      #0f1a12;
  --bg-raised:    #162019;
  --bg-hover:     #1c2a1f;

  /* accent */
  --green:        #22c55e;
  --green-dim:    rgba(34,197,94,0.12);
  --lime:         #a3e635;
  --amber:        #f59e0b;
  --red:          #ef4444;

  /* text */
  --text-1:       #f0fdf4;   /* headings */
  --text-2:       #86efac;   /* labels   */
  --text-3:       #4ade80;   /* muted    */

  /* borders */
  --border:       rgba(34,197,94,0.12);
  --border-strong:rgba(34,197,94,0.25);

  /* type */
  --font-display: 'Syne', sans-serif;
  --font-data:    'DM Mono', monospace;

  /* radius */
  --r-sm: 6px;
  --r-md: 12px;
  --r-lg: 18px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-base); color: var(--text-1); font-family: var(--font-data); }
```

### Green Score Map
```js
// used inside GreenScoreBadge.jsx
export const scoreMap = {
  A: { bg: '#14532d', color: '#4ade80', label: 'Excellent' },
  B: { bg: '#166534', color: '#86efac', label: 'Good'      },
  C: { bg: '#713f12', color: '#fcd34d', label: 'Moderate'  },
  D: { bg: '#7c2d12', color: '#fdba74', label: 'Poor'      },
  F: { bg: '#7f1d1d', color: '#fca5a5', label: 'Critical'  },
}
```

### Chart Theme — `src/styles/chartTheme.js`
```js
export const theme = {
  historical:  { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.07)' },
  forecast:    { borderColor: '#a3e635', borderDash: [5,4], backgroundColor: 'rgba(163,230,53,0.05)' },
  cost:        { backgroundColor: 'rgba(245,158,11,0.7)' },
  carbon:      { backgroundColor: 'rgba(34,197,94,0.7)'  },
  grid:        { color: 'rgba(255,255,255,0.04)' },
  tick:        { color: '#4ade80', font: { family: "'DM Mono'" } },
}
```

### Card pattern (copy-paste starting point)
```jsx
// every card uses this shell
<div style={{
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-md)',
  padding: '20px 24px',
}}>
  {children}
</div>
```

---

## API calls (`services/api.js`)
```js
import axios from 'axios'

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL })

http.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export const getDashboard       = ()  => http.get('/dashboard')
export const getUsage           = ()  => http.get('/usage')
export const getCarbon          = ()  => http.get('/carbon')
export const getForecast        = ()  => http.get('/forecast')
export const getRecommendations = ()  => http.get('/recommendations')
export const getGreenScore      = ()  => http.get('/green-score')
export const register           = (payload) => http.post('/register', payload)
export const login              = (payload) => http.post('/login', payload)
```

---

## Rules
- All API calls go through `services/api.js` — never inline fetch
- No hardcoded URLs or tokens
- `VITE_API_URL` is the only env variable you need
- Every data-fetching component handles loading + error + empty — no exceptions
