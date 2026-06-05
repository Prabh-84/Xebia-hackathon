# GreenOps AI — System Architecture

## Overview

GreenOps AI is structured as a **3-tier web application** with a dedicated **ML Layer** and a **Data Layer**, following a clean separation of concerns. The system is designed to be modular — each layer can be developed, tested, and deployed independently.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT                                │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │              REACT FRONTEND (Vite · Port 5173)                  │   │
│   │                                                                 │   │
│   │  ┌──────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────────┐   │   │
│   │  │Dashboard │ │ Forecast    │ │ Projects │ │ Copilot Chat │   │   │
│   │  └──────────┘ └─────────────┘ └──────────┘ └──────────────┘   │   │
│   │  ┌────────────────┐ ┌────────────────────────────────────────┐  │   │
│   │  │ Recommendations│ │  Login / Register (JWT Auth)           │  │   │
│   │  └────────────────┘ └────────────────────────────────────────┘  │   │
│   │                                                                 │   │
│   │  services/api.js (Axios) ──── All HTTP calls to backend        │   │
│   │  hooks/useFetch.js ─────────── Reusable async data hook        │   │
│   │  styles/globals.css ─────────── CSS Variables + Dark/Light     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ REST API (JSON over HTTP)
                                 │ JWT Token in Authorization Header
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS BACKEND (Node.js · Port 5000)               │
│                                                                         │
│   server.js  →  routes/authRoutes.js  →  controllers/authController.js │
│                         │                                               │
│                         ├── POST /register  (bcrypt hash + save User)  │
│                         ├── POST /login     (bcrypt compare + JWT sign) │
│                         ├── GET  /dashboard (auth middleware protected) │
│                         ├── GET  /usage                                 │
│                         ├── GET  /carbon                                │
│                         ├── GET  /forecast  ─────────────────────────┐ │
│                         ├── GET  /recommendations ───────────────────┤ │
│                         ├── GET  /green-score ───────────────────────┤ │
│                         ├── GET  /budget ───────────────────────────┐│ │
│                         ├── GET  /projects                          ││ │
│                         └── GET  /copilot?query= ──────────────────┘│ │
│                                                        │              │ │
│   middleware/authMiddleware.js ◄─── JWT Verification  │              │ │
└───────────────────────────────────────────────────────┼──────────────┼─┘
                                                        │              │
                    ┌───────────────────────────────────▼──────────────▼──┐
                    │              ML LAYER  (backend/ml/)                │
                    │                                                      │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │ carbonEngine.js                             │    │
                    │  │   processMetrics(metrics)                   │    │
                    │  │   → calculatedEmissionsKgCO2e               │    │
                    │  └─────────────────────────────────────────────┘    │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │ forecastEngine.js (JS growth-rate model)    │    │
                    │  │   generateForecast(history, window)         │    │
                    │  │   → { currentEmission, predictedEmission,   │    │
                    │  │       growthRate, forecastWindow, trend }    │    │
                    │  └──────────────────────────┬──────────────────┘    │
                    │  ┌───────────────────────────▼──────────────────┐   │
                    │  │ forecastModel.js + predict.py (ARIMA/Python) │   │
                    │  │   Spawns Python child_process                 │   │
                    │  │   Uses trained arima_model.pkl                │   │
                    │  └──────────────────────────────────────────────┘   │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │ recommendationEngine.js                     │    │
                    │  │   generateRecommendations(metrics)          │    │
                    │  │   → [{ title, description, priority,        │    │
                    │  │         expectedCarbonReduction,            │    │
                    │  │         expectedCostReduction }]            │    │
                    │  └─────────────────────────────────────────────┘    │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │ greenScoreEngine.js                         │    │
                    │  │   generateGreenScore(emission, intensity,   │    │
                    │  │                     efficiency)             │    │
                    │  │   → { greenScore: "B", scoreValue: 75 }     │    │
                    │  └─────────────────────────────────────────────┘    │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │ budgetEngine.js                             │    │
                    │  │   evaluateBudget(budget, current, forecast) │    │
                    │  │   → { utilization, status: "Warning" }      │    │
                    │  └─────────────────────────────────────────────┘    │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │ copilotEngine.js                            │    │
                    │  │   generateCopilotResponse(query, context)   │    │
                    │  │   → "Natural language explanation string"    │    │
                    │  └─────────────────────────────────────────────┘    │
                    └──────────────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────────────┐
                    │                  DATA LAYER                          │
                    │                                                      │
                    │  ┌──────────────┐    ┌──────────────────────────┐   │
                    │  │ CloudUsage   │    │ CarbonMetric             │   │
                    │  │ (Mongoose)   │    │ (Mongoose)               │   │
                    │  │              │    │                          │   │
                    │  │ projectId    │    │ projectId                │   │
                    │  │ provider     │    │ co2Emission              │   │
                    │  │ month        │    │ carbonIntensity          │   │
                    │  │ vmHours      │    │ greenScore               │   │
                    │  │ storageGB    │    └──────────────────────────┘   │
                    │  │ networkGB    │                                    │
                    │  │ cloudCost    │    Carbon Formula:                │
                    │  └──────────────┘    vmHours × 0.4                  │
                    │                    + storageGB × 0.02               │
                    │  seedData.js →       + networkGB × 0.01             │
                    │  awsData.json        = CO₂e kg                      │
                    │  azureData.json                                      │
                    └──────────────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────────────┐
                    │              MONGODB ATLAS (Cloud DB)                │
                    └──────────────────────────────────────────────────────┘
```

---

## Request Flow — Example: "Load Dashboard"

```
1. User opens browser → React app loads (Vite, port 5173)
2. Router redirects to /login
3. User submits credentials → POST /login
4. Backend: bcrypt.compare() → jwt.sign() → returns token
5. Frontend stores token in localStorage
6. React Router navigates to /dashboard
7. Dashboard component mounts → useFetch(getDashboard) fires
8. api.js attaches JWT from localStorage in Authorization header
9. GET /dashboard hits Express route
10. authMiddleware.js validates JWT → req.user populated
11. Route handler returns { totalCarbon, totalCost, greenScore, activeProjects }
12. React renders KPI Cards, Charts, GreenScoreBadge
```

---

## Frontend Component Tree

```
App.jsx
├── <BrowserRouter>
│   ├── /login        → Login.jsx
│   ├── /register     → Register.jsx
│   └── Layout (Sidebar + TopBar)
│       ├── /dashboard      → Dashboard.jsx
│       │   ├── KPICard (×4)
│       │   ├── EmissionsChart.jsx
│       │   └── GreenScoreBadge.jsx
│       ├── /forecast       → Forecast.jsx
│       │   └── ForecastChart.jsx
│       ├── /recommendations → Recommendations.jsx
│       │   └── RecommendationCard.jsx (×n)
│       ├── /projects       → Projects.jsx
│       │   ├── BudgetBar.jsx
│       │   └── CostCarbonChart.jsx
│       └── /copilot        → Copilot.jsx
│           └── Chat bubble UI (user + assistant)
```

---

## Authentication Flow

```
┌─────────┐     POST /register      ┌─────────────┐
│ Browser │ ──────────────────────► │   Backend   │
│         │  { name, email, pass }  │             │
│         │                         │ bcrypt.hash │
│         │                         │ User.create │
│         │ ◄─────────────────────  └─────────────┘
│         │  { message: "Registered" }
│         │
│         │     POST /login         ┌─────────────┐
│         │ ──────────────────────► │   Backend   │
│         │  { email, pass }        │             │
│         │                         │ User.findOne│
│         │                         │ bcrypt.comp │
│         │                         │ jwt.sign()  │
│         │ ◄─────────────────────  └─────────────┘
│         │  { token, user }
│         │
│         │  localStorage.setItem('token', token)
│         │
│         │  GET /dashboard         ┌─────────────┐
│         │ ──────────────────────► │ authMiddlwr │
│         │  Authorization: <token> │ jwt.verify()│
│         │                         │    ↓        │
│         │ ◄─────────────────────  │  Route Hdlr │
│         │  { dashboard data }     └─────────────┘
└─────────┘
```

---

## Dark / Light Mode System

```
CSS Variables in globals.css:

:root {
  --bg-base: #080e0b       → Page background (dark)
  --text-1: #e8f5e9        → Primary text (dark)
  --green: #22c55e         → Accent color
  --border: rgba(...)      → Card borders
}

.light-mode {
  --bg-base: #f0f4f1       → Overrides for light
  --text-1: #1a2e1e        → Dark text on light bg
}

TopBar.jsx toggle button
  → document.body.classList.toggle('light-mode')
  → All CSS variables cascade automatically
  → Chart.js reads getComputedStyle() for dynamic colors
```

---

## Deployment Architecture (Target)

```
                    ┌──────────────────┐
                    │   Vercel (CDN)   │  ← Frontend (React/Vite build)
                    │   Free Hobby Plan│
                    └────────┬─────────┘
                             │ HTTPS REST calls
                             ▼
                    ┌──────────────────┐
                    │  Render / Railway│  ← Backend (Node.js + Python)
                    │  (Multi-buildpack│    Requires: Node 18 + Python 3
                    │   Node + Python) │
                    └────────┬─────────┘
                             │ Mongoose ODM
                             ▼
                    ┌──────────────────┐
                    │  MongoDB Atlas   │  ← Cloud DB (Free M0 Cluster)
                    └──────────────────┘
```

---

## Environment Variables

### Backend (root `.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/greenops` |
| `JWT_SECRET` | Secret key for JWT signing | `mysupersecretkey123` |
| `PORT` | Backend server port | `5000` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:5000` (local) or `https://greenops-api.onrender.com` (prod) |
