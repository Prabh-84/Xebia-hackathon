# ML API Contracts

This document defines the interface for the ML calculation engines.

## 1. Carbon Engine
**File**: `backend/ml/carbonEngine.js`
- **processMetrics(metrics)**: Accepts raw telemetry and returns `calculatedEmissionsKgCO2e`.

## 2. Green Score Engine
**File**: `backend/ml/greenScoreEngine.js`
- **generateGreenScore(carbonEmission, carbonIntensity, energyEfficiency)**: Returns `{ greenScore, scoreValue, reason }`.

## 3. Recommendation Engine
**File**: `backend/ml/recommendationEngine.js`
- **generateRecommendations(metrics)**: Returns array of objects `{ title, description, priority, expectedCarbonReduction, expectedCostReduction }`.

## 4. Forecast Engine
**File**: `backend/ml/forecastEngine.js`
- **generateForecast(historicalEmissions, forecastWindow)**: Returns `{ currentEmission, predictedEmission, growthRate, forecastWindow, trend }`.

## 5. Budget Engine
**File**: `backend/ml/budgetEngine.js`
- **evaluateBudget(carbonBudget, currentEmission, forecastEmission)**: Returns `{ budget, currentEmission, forecastEmission, utilization, remainingBudget, status }`.

## 6. Copilot Engine
**File**: `backend/ml/copilotEngine.js`
- **generateCopilotResponse(query, context)**: Returns human-readable strings explaining infrastructure state based on context inputs.
