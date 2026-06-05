const express = require("express");
const { processMetrics } = require("../backend/ml/carbonEngine");
const { generateGreenScore } = require("../backend/ml/greenScoreEngine");
const { generateForecast } = require("../backend/ml/forecastEngine");
const { evaluateBudget } = require("../backend/ml/budgetEngine");
const { generateRecommendations } = require("../backend/ml/recommendationEngine");
const {
  generateCopilotResponse,
  SUPPORTED_QUERIES
} = require("../backend/ml/copilotEngine");

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
  try {
    const metrics = {
      cpu_usage: 68,
      memory_usage: 72,
      network_traffic: 450,
      power_consumption: 320,
      energy_efficiency: 84,
    };

    const result = processMetrics(metrics);

    res.json({
      carbonEmission: result.calculatedEmissionsKgCO2e,
      carbonIntensity: 0.475,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Forecast Data
router.get("/forecast", (req, res) => {
  try {

    const historicalEmissions = [
      120,
      135,
      150,
      165,
      180
    ];

    const result =
      generateForecast(
        historicalEmissions,
        1
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


// Recommendations
router.get("/recommendations", (req, res) => {
  try {

    const forecast = generateForecast(
      [120, 135, 150, 165, 180],
      1
    );

    const recommendations =
      generateRecommendations({
        cpu_usage: 10,
        memory_usage: 95,
        power_consumption: 320,
        energy_efficiency: 0.25,
        greenScore: "D",
        carbonEmission: 152,
        forecast
      });

    const frontendResponse =
      recommendations.map(item => ({
        recommendation: item.title,
        status: item.priority,
        expectedCarbonSaving:
          item.expectedCarbonReduction,
        expectedCostSaving:
          item.expectedCostReduction
      }));

    res.json(frontendResponse);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

// Green Score
router.get("/green-score", (req, res) => {
  try {
    const metrics = {
      cpu_usage: 68,
      memory_usage: 72,
      network_traffic: 450,
      power_consumption: 320,
      energy_efficiency: 0.84
    };

    const carbonResult = processMetrics(metrics);

    const result = generateGreenScore(
      carbonResult.calculatedEmissionsKgCO2e,
      0.475,
      metrics.energy_efficiency
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// Carbon Budget
router.get("/budget", (req, res) => {
  try {

    const historicalEmissions = [
      120,
      135,
      150,
      165,
      180
    ];

    const forecast =
      generateForecast(
        historicalEmissions,
        1
      );

    const result =
      evaluateBudget(
        250, // carbon budget
        forecast.currentEmission,
        forecast.predictedEmission
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

// GreenOps Copilot
router.get("/copilot", (req, res) => {
  try {

    const forecast = generateForecast(
      [120, 135, 150, 165, 180],
      1
    );

    const recommendations =
      generateRecommendations({
        cpu_usage: 10,
        memory_usage: 95,
        power_consumption: 320,
        energy_efficiency: 0.25,
        greenScore: "D",
        carbonEmission: 152,
        forecast
      });

    const answer =
      generateCopilotResponse(
        SUPPORTED_QUERIES.HOW_TO_REDUCE,
        {
          greenScore: "D",
          carbonEmission: 152,
          carbonIntensity: 0.475,
          recommendations,
          forecast,
          budgetStatus: "Warning"
        }
      );

    res.json({
      question: SUPPORTED_QUERIES.HOW_TO_REDUCE,
      answer
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;