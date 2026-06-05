# GreenOps AI — System Architecture

## Overview

GreenOps AI is structured as a **3-tier web application** with a dedicated **ML Layer** and a **Data Layer**, following a clean separation of concerns. The system is designed to be modular — each layer can be developed, tested, and deployed independently.

---

## 🏗️ High-Level System Architecture

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#fff;
    classDef backend fill:#14532D,stroke:#22C55E,stroke-width:2px,color:#fff;
    classDef ml fill:#4C1D95,stroke:#8B5CF6,stroke-width:2px,color:#fff;
    classDef db fill:#064E3B,stroke:#10B981,stroke-width:2px,color:#fff;

    subgraph Client ["🖥️ Client Tier"]
        React["React.js SPA (Vite)"]:::frontend
        Axios["Axios / API Services"]:::frontend
        React --> Axios
    end

    subgraph Server ["⚙️ Application Tier (Node.js)"]
        Express["Express.js Server"]:::backend
        Middleware["JWT Auth Middleware"]:::backend
        Controllers["Auth & Route Controllers"]:::backend
        
        Axios -- "HTTP REST" --> Express
        Express --> Middleware
        Middleware --> Controllers
    end

    subgraph MachineLearning ["🧠 Intelligence Tier"]
        JSEngines["JS ML Engines<br/>(Carbon, Budget, Recommendations)"]:::ml
        PyBridge["Python Bridge<br/>(child_process)"]:::ml
        ARIMA["ARIMA Model<br/>(scikit-learn/statsmodels)"]:::ml
        
        Controllers -- "Function Calls" --> JSEngines
        JSEngines --> PyBridge
        PyBridge --> ARIMA
    end

    subgraph Database ["💾 Data Tier"]
        Mongoose["Mongoose ODM"]:::db
        MongoAtlas[("MongoDB Atlas<br/>Cloud Database")]:::db
        
        Controllers -- "CRUD Operations" --> Mongoose
        Mongoose --> MongoAtlas
    end
```

---

## 🎨 Frontend Component Tree

```mermaid
graph TD
    classDef router fill:#0F172A,stroke:#64748B,stroke-width:2px,color:#fff;
    classDef page fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#fff;
    classDef comp fill:#334155,stroke:#94A3B8,stroke-width:1px,color:#fff;

    App["App.jsx (BrowserRouter)"]:::router
    Layout["Layout (Sidebar + TopBar)"]:::comp
    
    App --> Login["Login.jsx"]:::page
    App --> Register["Register.jsx"]:::page
    App --> Layout
    
    Layout --> Dashboard["/dashboard"]:::page
    Layout --> Forecast["/forecast"]:::page
    Layout --> Recommendations["/recommendations"]:::page
    Layout --> Projects["/projects"]:::page
    Layout --> Copilot["/copilot"]:::page

    Dashboard --> KPICard["KPICard (x4)"]:::comp
    Dashboard --> EmissionsChart["EmissionsChart"]:::comp
    Dashboard --> GreenScoreBadge["GreenScoreBadge"]:::comp
    
    Projects --> BudgetBar["BudgetBar"]:::comp
    Projects --> CostCarbonChart["CostCarbonChart"]:::comp
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Express as Backend (Express)
    participant DB as MongoDB Atlas

    %% Registration
    Browser->>Express: POST /register {name, email, pass}
    Express->>Express: bcrypt.hash(password)
    Express->>DB: User.create()
    DB-->>Express: Success
    Express-->>Browser: {message: "Registered"}

    %% Login
    Browser->>Express: POST /login {email, pass}
    Express->>DB: User.findOne({email})
    DB-->>Express: User Document
    Express->>Express: bcrypt.compare()
    Express->>Express: jwt.sign()
    Express-->>Browser: {token, user}
    Browser->>Browser: localStorage.setItem('token')

    %% Protected Route
    Browser->>Express: GET /dashboard (Header: Authorization)
    Express->>Express: authMiddleware (jwt.verify)
    Express-->>Browser: { totalCarbon, greenScore... }
```

---

## 🧠 ML Layer Execution Flow

```mermaid
flowchart LR
    classDef req fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#fff;
    classDef eng fill:#4C1D95,stroke:#8B5CF6,stroke-width:2px,color:#fff;
    classDef py fill:#854D0E,stroke:#F59E0B,stroke-width:2px,color:#fff;

    Req["GET /forecast"]:::req --> Router["authRoutes.js"]
    Router --> ForecastEng["forecastEngine.js"]:::eng
    
    ForecastEng -- "spawn('python')" --> PredictPy["predict.py"]:::py
    PredictPy -- "Loads" --> Pickle[("arima_model.pkl")]:::py
    PredictPy -- "Generates" --> JSON["Forecast JSON"]:::py
    JSON -- "stdout" --> ForecastEng
    ForecastEng --> Router
    Router --> Res["HTTP 200 OK"]:::req
```

---

## Deployment Architecture (Target)

```mermaid
graph TD
    classDef cloud fill:#0F172A,stroke:#64748B,stroke-width:2px,color:#fff;
    
    User(("User Browser"))
    
    subgraph Vercel ["Vercel Edge Network (Frontend)"]
        CDN["Static Assets + React App"]:::cloud
    end
    
    subgraph Render ["Render / Railway (Backend)"]
        Node["Node.js Runtime"]:::cloud
        Python["Python 3 Environment"]:::cloud
        Node <--> Python
    end
    
    subgraph Mongo ["MongoDB Atlas (Database)"]
        Cluster[("M0 Free Cluster")]:::cloud
    end
    
    User -- "HTTPS" --> CDN
    CDN -- "REST API (Axios)" --> Node
    Node -- "Mongoose (TCP)" --> Cluster
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
