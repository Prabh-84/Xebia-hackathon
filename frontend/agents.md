Agent Instructions — Nandan (Frontend)
GreenOps AI Dashboard · Hackathon

Who You Are
You are an AI coding agent building the frontend only for GreenOps AI Dashboard. You write React with Vite. You do not touch the backend, database, or ML logic. All data comes from APIs that Prabhjot owns.
Your single job: turn API responses into a dashboard that looks like a real product, not a hackathon template.

Project Context
GreenOps is a carbon emissions dashboard for cloud infrastructure (AWS + Azure). It shows CO2e metrics, forecasts, optimization recommendations, and assigns A–F green scores to services. Users are engineers and sustainability leads at Xebia.
Tone of the UI: Data-dense but calm. Think Bloomberg terminal meets climate tech — dark background, green accents, monospace numbers, clean hierarchy. Not playful. Not corporate blue. Not purple gradients.

Environment
VITE_API_URL=http://localhost:5000   ← dev
VITE_API_URL=https://your-render-url ← prod (set in Vercel dashboard)
Never put this in code. Always read via import.meta.env.VITE_API_URL.

File You Must Create (in order)
1. src/styles/globals.css
Paste these exact tokens. Do not change variable names — components reference them.
css@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');

:root {
  --bg-base:      #080e0b;
  --bg-card:      #0f1a12;
  --bg-raised:    #162019;
  --bg-hover:     #1c2a1f;
  --green:        #22c55e;
  --green-dim:    rgba(34,197,94,0.12);
  --lime:         #a3e635;
  --amber:        #f59e0b;
  --red:          #ef4444;
  --text-1:       #f0fdf4;
  --text-2:       #86efac;
  --text-3:       #4ade80;
  --border:       rgba(34,197,94,0.12);
  --border-strong:rgba(34,197,94,0.25);
  --font-display: 'Syne', sans-serif;
  --font-data:    'DM Mono', monospace;
  --r-sm: 6px; --r-md: 12px; --r-lg: 18px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-base); color: var(--text-1); font-family: var(--font-data); -webkit-font-smoothing: antialiased; }

2. src/styles/chartTheme.js
jsexport const theme = {
  historical:  { borderColor: '#22c55e', borderWidth: 2, backgroundColor: 'rgba(34,197,94,0.07)', tension: 0.4, pointRadius: 3, pointHoverRadius: 5 },
  forecast:    { borderColor: '#a3e635', borderWidth: 2, borderDash: [5,4], backgroundColor: 'rgba(163,230,53,0.05)', tension: 0.4, pointRadius: 0 },
  cost:        { backgroundColor: 'rgba(245,158,11,0.75)', borderRadius: 4 },
  carbon:      { backgroundColor: 'rgba(34,197,94,0.75)',  borderRadius: 4 },
  grid:        { color: 'rgba(255,255,255,0.04)', drawBorder: false },
  ticks:       { color: '#4ade80', font: { family: "'DM Mono'", size: 11 } },
  legend:      { labels: { color: '#86efac', font: { family: "'DM Mono'", size: 11 } } },
}

3. src/services/api.js
jsimport axios from 'axios'

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL })

http.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export const getDashboard       = ()  => http.get('/dashboard')
export const getForecast        = ()  => http.get('/forecast')
export const getRecommendations = ()  => http.get('/recommendations')
export const getGreenScore      = ()  => http.get('/green-score')
export const getBudget          = ()  => http.get('/budget')
export const getCopilot         = (q) => http.get(`/copilot?query=${encodeURIComponent(q)}`)

4. src/hooks/useFetch.js
jsimport { useState, useEffect, useCallback } from 'react'

export function useFetch(apiFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const run = useCallback(async () => {
    setLoading(true); setError(null)
    try   { const res = await apiFn(); setData(res.data) }
    catch { setError('Failed to load data.') }
    finally { setLoading(false) }
  }, deps)

  useEffect(() => { run() }, [run])
  return { data, loading, error, refetch: run }
}

5. src/components/layout/Sidebar.jsx
Build a fixed left sidebar (240px wide on desktop). It must:

Show the GreenOps logo/wordmark at the top using var(--font-display)
Have 5 nav links: Dashboard /, Forecast /forecast, Recommendations /recommendations, Projects /projects, Copilot /copilot
Use NavLink from react-router-dom; active link gets background: var(--bg-raised) and color: var(--green)
On mobile (<768px) hide it completely — replaced by bottom tab bar

Each nav item: 14px icon (use a simple unicode or inline SVG — no icon library) + label in var(--font-data).

6. src/components/layout/TopBar.jsx
Thin bar (56px tall) at top of the main content area.

Left: current page name in var(--font-display), 18px, var(--text-1)
Right: small circle with user initial + username, read from localStorage.getItem('user') (JSON, has .name)
Bottom border: 1px solid var(--border)


7. src/components/ui/Skeleton.jsx
jsx// Pulsing placeholder, no library needed
const pulse = `
  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
`
export function Skeleton({ w = '100%', h = 20, r = 'var(--r-sm)' }) {
  return (
    <>
      <style>{pulse}</style>
      <div style={{ width: w, height: h, borderRadius: r,
        background: 'var(--bg-raised)', animation: 'pulse 1.4s ease infinite' }} />
    </>
  )
}

8. src/components/ui/KPICard.jsx
Props: label (string), value (string|number), unit (string), delta (number — positive or negative %)
┌─────────────────────────────┐
│  LABEL                 unit │  ← label: var(--text-3) 11px uppercase
│                             │
│  1,284                 +8%  │  ← value: var(--font-display) 32px
│                       ↑     │  ← delta: green if positive, red if negative
└─────────────────────────────┘
background: var(--bg-card)
border: 1px solid var(--border)
border-radius: var(--r-md)
padding: 20px 24px

9. src/components/ui/GreenScoreBadge.jsx
Props: score (A|B|C|D|F), size (sm|md — default md)
jsconst map = {
  A: { bg: '#14532d', color: '#4ade80', label: 'Excellent' },
  B: { bg: '#166534', color: '#86efac', label: 'Good'      },
  C: { bg: '#713f12', color: '#fcd34d', label: 'Moderate'  },
  D: { bg: '#7c2d12', color: '#fdba74', label: 'Poor'      },
  F: { bg: '#7f1d1d', color: '#fca5a5', label: 'Critical'  },
}
md size: pill shape, {score} · {label}, font-size 13px, padding 4px 12px.
sm size: square badge, just the letter, 28×28px, font-size 15px bold.

10. src/components/ui/RecommendationCard.jsx
Props: recommendation (string), status (Pending|Done), expectedCarbonSaving (number), expectedCostSaving (number)
Layout:

Top: status chip (Pending = amber, Done = green) aligned right
Middle: recommendation text, var(--text-1), 14px, 2-line max then ellipsis
Bottom row: two small pills — ↓ {X} kg CO2e (green tint) and ↓ ${Y} (amber tint)

Card background: var(--bg-card), border: var(--border), hover: var(--bg-hover) transition 150ms.

11. src/components/ui/BudgetBar.jsx
Props: budget (number), current (number), forecast (number)
Render a single horizontal bar with 3 labeled segments:

Current usage: filled green
Forecast overage (if forecast > budget): filled amber
Remaining budget: empty (dark)

Below the bar: status chip — Safe (green) if current < 80% of budget · Warning (amber) if 80–100% · Exceeded (red) if over.
Show exact numbers below: Current: 850 kg · Forecast: 1,150 kg · Budget: 1,000 kg

12. src/components/charts/EmissionsChart.jsx
Line chart using react-chartjs-2. Data shape expected from GET /dashboard:
json{ "history": [{ "month": "Jan", "co2": 120 }, ...] }
Apply theme.historical from chartTheme.js. Grid from theme.grid. Ticks from theme.ticks. No legend. Tooltip background #0f1a12, border var(--border-strong).

13. src/components/charts/ForecastChart.jsx
Two datasets on one chart:

Historical months: theme.historical (solid line)
Forecast months: theme.forecast (dashed line)

The point where historical ends and forecast begins should have a faint vertical dashed line annotation. If react-chartjs-2 annotation plugin isn't available, skip the line and just label the first forecast point "Forecast →".
Data shape from GET /forecast:
json{
  "historical": [{ "month": "Jan", "co2": 100 }, ...],
  "forecast":   [{ "month": "Apr", "co2": 183 }, ...]
}

14. src/components/charts/CostCarbonChart.jsx
Grouped bar chart. Two bars per project: cost (amber) and co2e (green). Dual Y-axis (left = kg, right = USD).
Data shape from GET /dashboard or build a combined call:
json{ "projects": [{ "name": "Payroll", "cost": 430, "co2": 95 }, ...] }

15. Pages
Dashboard.jsx
<TopBar />
Grid 2×2 of <KPICard />s
<EmissionsChart /> (takes 60% width) | <GreenScoreBadge size="md" /> panel (40%)
<BudgetBar /> at the bottom
All data from useFetch(getDashboard).
Forecast.jsx
<ForecastChart />
Summary line: "Emissions forecast to reach {forecast[-1].co2} kg by {forecast[-1].month}"
Data from useFetch(getForecast).
Recommendations.jsx
Filter chips at top: All · Pending · Done
2-column grid of <RecommendationCard />s (1-col on mobile)
Data from useFetch(getRecommendations).
Projects.jsx
Table with columns: Project · Provider · Region · CO2e · Cost · Score
Score column renders <GreenScoreBadge size="sm" />
Sortable by CO2e column (click header toggles asc/desc)
Copilot.jsx
Full-height flex column:
  - Scroll area (messages grow here)
  - Fixed input row at bottom: text input + Send button

User message: right-aligned bubble, bg var(--bg-raised), text var(--text-1)
Bot message:  left-aligned bubble, bg var(--green-dim), text var(--text-2), font var(--font-data)
On submit: push user message immediately, then call getCopilot(query), then push response. Show a Skeleton for 1 row while waiting.

Rules You Must Follow

No inline fetch. Every API call goes through services/api.js. If you need a new endpoint, add it there first.
Every data-fetching component handles three states — loading (Skeleton), error (text + retry button), and empty (icon + message). No exceptions.
No hardcoded colors. Use CSS variables from globals.css. If you need a one-off, add a variable.
Numbers always formatted. CO2e → X,XXX.X kg · Cost → $X,XXX · Percentages → +X% with sign.
No icon library. Use unicode symbols or tiny inline SVGs. Keeps bundle small.
Font rule: All metric numbers use var(--font-data) (DM Mono). All headings and KPI large values use var(--font-display) (Syne). Never swap them.
Chart.js must use chartTheme.js. Never hardcode chart colors inline.
Mobile layout — at < 768px: sidebar hidden, bottom tab bar shown with 5 icons. Cards go single column. Tables get horizontal scroll.
No external UI component libraries — no shadcn, no MUI, no Chakra. Build everything from the design system above.
VITE_API_URL is the only env variable. If the API is not yet up, mock the response shape locally and add a // TODO: remove mock comment.
