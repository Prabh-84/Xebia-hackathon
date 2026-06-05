const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  register,
  login,
} = require("../controllers/authController");


// Home Route
router.get("/", (req, res) => {
  res.send("GreenOps Backend Running");
});


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Protected Dashboard
router.get("/dashboard", auth, (req, res) => {
  res.json({
    totalCarbon: 850,
    totalCost: 1200,
    greenScore: "B",
    activeProjects: 5,
  });
});


// Usage Data
router.get("/usage", (req, res) => {
  res.json({
    cpu_usage: 68,
    memory_usage: 72,
    network_traffic: 450,
    power_consumption: 320,
    energy_efficiency: 84,
    timestamp: new Date(),
  });
});


// Carbon Data
router.get("/carbon", (req, res) => {
  res.json({
    carbonEmission: 850,
    carbonIntensity: 65,
  });
});


// Forecast Data
router.get("/forecast", (req, res) => {
  res.json({
    currentEmission: 850,
    predictedEmission: 1050,
    growthRate: 23.5,
    trend: "Increasing",
  });
});


// Recommendations
router.get("/recommendations", (req, res) => {
  res.json([
    {
      title: "Rightsize VM",
      description: "Reduce oversized VM instances",
      priority: "High",
      expectedCarbonReduction: 120,
      expectedCostReduction: 80,
    },
    {
      title: "Archive Old Storage",
      description: "Move unused data to cheaper storage",
      priority: "Medium",
      expectedCarbonReduction: 60,
      expectedCostReduction: 40,
    },
  ]);
});


// Green Score
router.get("/green-score", (req, res) => {
  res.json({
    greenScore: "B",
    scoreValue: 75,
    reason: "Moderate carbon intensity detected",
  });
});


// Carbon Budget
router.get("/budget", (req, res) => {
  res.json({
    budget: 1000,
    currentEmission: 850,
    forecastEmission: 1100,
    utilization: 85,
    remainingBudget: 150,
    status: "Warning",
  });
});


// GreenOps Copilot
router.get("/copilot", (req, res) => {
  res.json({
    question: "Why did emissions increase?",
    answer:
      "Storage usage increased by 20% and network traffic increased by 15%. Recommended action: archive unused storage and resize VMs.",
  });
});

module.exports = router;