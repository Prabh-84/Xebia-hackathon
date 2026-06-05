# 🌿 GreenOps AI — Unified Carbon Reduction Dashboard

> **Xebia Hackathon 2026** · Built by Team GreenOps

GreenOps AI is a full-stack, AI-powered sustainability intelligence platform that transforms raw cloud infrastructure telemetry into actionable carbon-reduction insights. It empowers engineering teams to track, forecast, and reduce their cloud carbon footprint in real time.

---

## 📸 Screenshots

| Login | Dashboard | Copilot |
|-------|-----------|---------|
| Premium dark terminal UI | Live KPIs, Charts & Green Score | AI-powered chat assistant |

---

## ✨ Features

- 🔐 **JWT-based Authentication** — Secure Register & Login
- 📊 **Live Dashboard** — Total Carbon, Cost, Green Score, Active Projects
- 📈 **Emissions Charts** — Historical CO₂e trends with dark/light theme support
- 🔮 **AI Forecast Engine** — ARIMA-powered predictive model (Python) + JS growth-rate engine
- 💡 **Recommendation Engine** — Intelligent rule-based & ML-driven optimization suggestions
- 🤖 **GreenOps Copilot** — Natural language Q&A assistant for infrastructure insights
- 💰 **Budget Tracker** — Visual carbon budget utilization bar with Safe / Warning / Exceeded status
- 🏆 **Green Score Badge** — A/B/C/D/F rating based on carbon intensity
- 🌗 **Dark & Light Mode** — Full theme toggle with CSS variable system
- 📱 **Fully Responsive** — Works on mobile, tablet and desktop

---

## 🏗️ Architecture

```
xebia_hackathon/
├── frontend/                  # React + Vite (Nandan)
│   └── src/
│       ├── pages/             # Dashboard, Forecast, Recommendations, Projects, Copilot, Login, Register
│       ├── components/
│       │   ├── charts/        # Chart.js charts (ForecastChart, EmissionsChart, CostCarbonChart)
│       │   ├── layout/        # Sidebar, TopBar (with theme toggle)
│       │   └── ui/            # KPICard, GreenScoreBadge, BudgetBar, RecommendationCard, Skeleton
│       ├── hooks/             # useFetch (reusable API hook)
│       ├── services/          # api.js (Axios instance + all endpoints)
│       └── styles/            # globals.css (CSS variables, dark/light mode)
│
├── backend/
│   └── ml/                    # AI/ML Engines (Parth)
│       ├── carbonEngine.js    # Calculates CO₂e from raw telemetry
│       ├── forecastEngine.js  # Growth-rate based emission forecast
│       ├── forecastModel.js   # ARIMA Python model bridge
│       ├── greenScoreEngine.js# A-F Green Score generator
│       ├── recommendationEngine.js # AI-driven optimization suggestions
│       ├── budgetEngine.js    # Budget utilization & alert engine
│       ├── copilotEngine.js   # Natural language response generator
│       ├── train_arima.py     # ARIMA model training script
│       └── predict.py         # Python prediction runner
│
├── DataLayer/                 # Data models & seeding (Mannat)
│   ├── models/
│   │   ├── CloudUsage.js      # Mongoose model: cloud telemetry
│   │   └── CarbonMetric.js    # Mongoose model: carbon metrics
│   ├── utils/
│   │   ├── carbonCalculator.js# Formula: vmHours*0.4 + storageGB*0.02 + networkGB*0.01
│   │   └── normalizer.js      # Data normalization utilities
│   ├── data/
│   │   ├── awsData.json       # AWS seed dataset (5 records)
│   │   └── azureData.json     # Azure seed dataset
│   └── seedData.js            # DB seeding script
│
├── config/
│   └── db.js                  # Mongoose connection
├── controllers/
│   └── authController.js      # Register & Login logic (bcrypt + JWT)
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── models/
│   └── user.js                # User schema (name, email, hashed password)
├── routes/
│   └── authRoutes.js          # All Express API routes
├── server.js                  # Entry point (Express + CORS + MongoDB)
├── docs/                      # Technical documentation
│   ├── ml-api-contracts.md
│   ├── ml-design-specification.md
│   └── dataset-mapping.md
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Chart.js, Axios |
| **Styling** | Vanilla CSS, CSS Variables (dark/light mode), Glassmorphism |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **ML/AI** | Custom JS Engines + Python ARIMA (scikit-learn) |
| **Dev Tools** | nodemon, Vite HMR |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- Python 3.8+ (for ARIMA forecasting only)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/Prabh-84/Xebia-hackathon.git
cd Xebia-hackathon
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install & Run the Backend
```bash
# From root directory
npm install
node server.js
# Server running on http://localhost:5000
```

### 4. Seed the Database (Optional)
```bash
# Populates MongoDB with AWS + Azure sample data
node DataLayer/seedData.js
```

### 5. Install & Run the Frontend
```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT token |
| `GET` | `/dashboard` | ✅ | Carbon, cost, green score, active projects |
| `GET` | `/usage` | ❌ | CPU, memory, network, power telemetry |
| `GET` | `/carbon` | ❌ | Total carbon emission & intensity |
| `GET` | `/forecast` | ❌ | AI predicted emission + trend |
| `GET` | `/recommendations` | ❌ | Array of AI optimization suggestions |
| `GET` | `/green-score` | ❌ | A-F grade + score value + reason |
| `GET` | `/budget` | ❌ | Budget utilization status |
| `GET` | `/projects` | ❌ | List of cloud projects with emissions |
| `GET` | `/copilot?query=` | ❌ | Natural language AI response |

### Sample Responses

**GET /forecast**
```json
{
  "currentEmission": 961408.91,
  "predictedEmission": 961023.87,
  "growthRate": -0.0004,
  "forecastWindow": 30,
  "trend": "stable"
}
```

**GET /recommendations**
```json
[
  {
    "title": "Rightsize EC2 Instances",
    "description": "Reduce oversized VM instances in us-east-1",
    "priority": "High",
    "expectedCarbonReduction": 120,
    "expectedCostReduction": 80
  }
]
```

**GET /green-score**
```json
{
  "greenScore": "B",
  "scoreValue": 75,
  "reason": "Moderate carbon intensity detected"
}
```

---

## 🤖 ML Layer

The ML layer (`backend/ml/`) is a fully self-contained set of engines with zero external Node.js dependencies:

| Engine | Function | Description |
|--------|----------|-------------|
| `carbonEngine.js` | `processMetrics(metrics)` | Converts raw telemetry to kg CO₂e |
| `forecastEngine.js` | `generateForecast(history, window)` | Growth-rate based emission prediction |
| `forecastModel.js` | `runArimaForecast(data)` | Calls Python ARIMA model via child_process |
| `greenScoreEngine.js` | `generateGreenScore(emission, intensity, efficiency)` | Returns A-F grade |
| `recommendationEngine.js` | `generateRecommendations(metrics)` | Rule-based + ML optimization suggestions |
| `budgetEngine.js` | `evaluateBudget(budget, current, forecast)` | Budget status: Safe / Warning / Exceeded |
| `copilotEngine.js` | `generateCopilotResponse(query, context)` | NL explanation of infrastructure state |

> ⚠️ **Deployment Note:** The ARIMA model requires **Python 3** on the deployment server. Use a multi-buildpack setup on Render/Railway (Node.js + Python).

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Nandan** | Frontend Engineer | React UI, Charts, Dark/Light Mode, Copilot UI, API Integration |
| **Prabhjot** | Backend/DevOps | Express API, MongoDB, Auth, Deployment |
| **Parth** | ML Engineer | ARIMA Model, Forecast/Carbon/Recommendation Engines |
| **Mannat** | Data Engineer | Data Layer, MongoDB Models, Seeding, Normalization |

---

## 📝 License

This project was built for the **Xebia Hackathon 2026**. All rights reserved by the GreenOps Team.
