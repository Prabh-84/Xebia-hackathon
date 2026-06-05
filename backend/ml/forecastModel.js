/**
 * GreenOps AI Dashboard - ARIMA Forecast Model Wrapper
 * 
 * Invokes the trained Python ARIMA model to generate a true ML forecast 
 * for future carbon emissions.
 */

const { execSync } = require('child_process');
const path = require('path');

/**
 * Validates the input array (kept for backward compatibility with the old engine).
 */
function validateData(historicalEmissions) {
    if (!Array.isArray(historicalEmissions)) {
        throw new Error('Validation Error: historicalEmissions must be an array');
    }
    return true;
}

/**
 * Executes the Python prediction script and parses the ML forecast.
 * 
 * @param {Array<number>} historicalEmissions - (Optional for ML model as it's pre-trained)
 * @param {number} [forecastWindow=30] - Number of future days to predict
 * @returns {Object} - Structured forecast including predictedEmission and trend
 */
function generateForecast(historicalEmissions = [], forecastWindow = 30) {
    // We still validate if data is provided, to ensure API compatibility
    if (historicalEmissions.length > 0) {
        validateData(historicalEmissions);
    }

    try {
        const scriptPath = path.join(__dirname, 'predict.py');
        const pythonPath = path.join(__dirname, 'ml_env', 'bin', 'python3');
        
        // Spawn synchronous Python process to run the model
        const output = execSync(`"${pythonPath}" "${scriptPath}" ${forecastWindow}`, { encoding: 'utf-8' });
        
        // Parse the JSON emitted from Python
        const result = JSON.parse(output.trim());
        
        if (result.error) {
            throw new Error(result.error);
        }

        return result;

    } catch (error) {
        throw new Error(`Failed to execute ML forecast model: ${error.message}`);
    }
}

module.exports = {
    validateData,
    generateForecast
};
