/**
 * GreenOps AI Dashboard - Forecast Engine
 * 
 * A lightweight forecasting engine that predicts future carbon emissions 
 * based on simple trend analysis and average historical growth rates.
 * Designed specifically to avoid complex ML overhead for hackathon purposes.
 */

/**
 * Validates the historical emissions data array.
 * 
 * @param {Array<number>} historicalEmissions - Array of chronological carbon emissions (oldest to newest)
 * @returns {boolean} - true if valid, throws error otherwise
 */
function validateData(historicalEmissions) {
    if (!Array.isArray(historicalEmissions)) {
        throw new Error('Validation Error: historicalEmissions must be an array');
    }
    if (historicalEmissions.length < 2) {
        throw new Error('Validation Error: At least 2 historical data points are required for forecasting');
    }

    for (let i = 0; i < historicalEmissions.length; i++) {
        if (typeof historicalEmissions[i] !== 'number' || isNaN(historicalEmissions[i])) {
            throw new Error(`Validation Error: Value at index ${i} must be a valid number`);
        }
    }

    return true;
}

/**
 * Calculates the average period-over-period growth rate.
 * 
 * @param {Array<number>} historicalEmissions - Array of historical emissions
 * @returns {number} - The average decimal growth rate (e.g., 0.05 for 5% growth)
 */
function calculateAverageGrowthRate(historicalEmissions) {
    let totalGrowthRate = 0;
    let periods = historicalEmissions.length - 1;

    for (let i = 0; i < periods; i++) {
        const current = historicalEmissions[i];
        const next = historicalEmissions[i + 1];
        
        // Protect against division by zero
        if (current === 0) {
            // If it went from 0 to something, treat as 100% growth for that step, or 0 if it stayed 0.
            totalGrowthRate += (next > 0) ? 1.0 : 0.0;
        } else {
            totalGrowthRate += (next - current) / current;
        }
    }

    return totalGrowthRate / periods;
}

/**
 * Generates a carbon emission forecast for the specified number of future periods.
 * 
 * @param {Array<number>} historicalEmissions - Chronological array of carbon emissions
 * @param {number} [forecastWindow=1] - Number of future periods to forecast (e.g., 1 day/week/month ahead)
 * @returns {Object} - The structured forecast report
 */
function generateForecast(historicalEmissions, forecastWindow = 1) {
    // 1. Validate the input
    validateData(historicalEmissions);

    if (typeof forecastWindow !== 'number' || forecastWindow <= 0) {
        throw new Error('Validation Error: forecastWindow must be a positive integer');
    }

    // 2. Identify Current Emission (the last known data point)
    const currentEmission = historicalEmissions[historicalEmissions.length - 1];

    // 3. Calculate Average Growth Rate
    const growthRate = calculateAverageGrowthRate(historicalEmissions);

    // 4. Predict Future Emission using compound growth formula
    // Formula: Future = Current * (1 + GrowthRate)^Periods
    const predictedEmission = currentEmission * Math.pow(1 + growthRate, forecastWindow);

    // 5. Determine Trend Description
    let trend = 'stable';
    if (growthRate > 0.01) {
        trend = 'increasing';
    } else if (growthRate < -0.01) {
        trend = 'decreasing';
    }

    // 6. Return Structured Output
    return {
        currentEmission: Number(currentEmission.toFixed(4)),
        predictedEmission: Number(predictedEmission.toFixed(4)),
        growthRate: Number(growthRate.toFixed(4)),
        forecastWindow: forecastWindow,
        trend: trend
    };
}

module.exports = {
    validateData,
    calculateAverageGrowthRate,
    generateForecast
};
