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
    vmHours: 600,
    storageGB: 1200,
    networkGB: 400,
  });
});


// Carbon Data
router.get("/carbon", (req, res) => {
  res.json({
    carbonEmission: 850,
  });
});


// Forecast Data
router.get("/forecast", (req, res) => {
  res.json([
    { month: "Apr", value: 180 },
    { month: "May", value: 220 },
    { month: "Jun", value: 260 },
  ]);
});


// Recommendations
router.get("/recommendations", (req, res) => {
  res.json([
    "Rightsize VM",
    "Archive Old Storage",
  ]);
});


// Green Score
router.get("/green-score", (req, res) => {
  res.json({
    score: "B",
  });
});

module.exports = router;