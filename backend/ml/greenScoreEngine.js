/**
 * GreenOps AI Dashboard - Green Score Engine
 * 
 * This engine calculates a "Green Score" (0-100) and assigns a letter grade (A-F)
 * based on carbon emissions, carbon intensity, and energy efficiency.
 */

// Configurable thresholds for grades
const SCORE_THRESHOLDS = {
    A: 90,
    B: 80,
    C: 70,
    D: 60
    // F is anything below 60
};

// Maximum expected emissions per task/vm to normalize the score
// This should be adjusted based on the specific dataset distribution
const MAX_EXPECTED_EMISSION = 500; 

/**
 * Validates the inputs to ensure they are present and are numbers.
 * 
 * @param {number} carbonEmission - Calculated carbon emissions
 * @param {number} carbonIntensity - Carbon intensity factor used
 * @param {number} energyEfficiency - Energy efficiency metric from dataset
 * @returns {boolean} - true if valid, throws error otherwise
 */
function validateInputs(carbonEmission, carbonIntensity, energyEfficiency) {
    const inputs = { carbonEmission, carbonIntensity, energyEfficiency };
    
    for (const [key, value] of Object.entries(inputs)) {
        if (value === undefined || value === null) {
            throw new Error(`Validation Error: Missing required input '${key}'`);
        }
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`Validation Error: '${key}' must be a valid number`);
        }
        if (value < 0) {
            throw new Error(`Validation Error: '${key}' cannot be negative`);
        }
    }

    return true;
}

/**
 * Calculates a numerical score (0-100) based on the inputs.
 * 
 * @param {number} carbonEmission - Calculated carbon emissions
 * @param {number} energyEfficiency - Energy efficiency metric from dataset (assumes 0 to 1 range)
 * @returns {number} - A score between 0 and 100
 */
function calculateScoreValue(carbonEmission, energyEfficiency) {
    // 1. Normalize emissions (Lower emission is better)
    // If emission > MAX_EXPECTED_EMISSION, it gets 0 points for the emission part.
    const emissionScoreRaw = Math.max(0, 1 - (carbonEmission / MAX_EXPECTED_EMISSION));
    const emissionScore = emissionScoreRaw * 50; // Contributes up to 50 points

    // 2. Normalize energy efficiency (Higher is better)
    // Assuming energyEfficiency is a decimal like 0.8 (80% efficient)
    const efficiencyScore = Math.min(1, energyEfficiency) * 50; // Contributes up to 50 points

    // Total score is out of 100
    const totalScore = Math.round(emissionScore + efficiencyScore);
    
    return Math.min(100, Math.max(0, totalScore));
}

/**
 * Maps a numerical score to a letter grade and a reason.
 * 
 * @param {number} scoreValue - The numerical score (0-100)
 * @returns {Object} - An object containing the grade and the reason
 */
function determineGradeAndReason(scoreValue) {
    if (scoreValue >= SCORE_THRESHOLDS.A) {
        return { greenScore: 'A', reason: 'Excellent energy efficiency and very low carbon footprint.' };
    } else if (scoreValue >= SCORE_THRESHOLDS.B) {
        return { greenScore: 'B', reason: 'Good performance, but slight room for improvement in emissions or efficiency.' };
    } else if (scoreValue >= SCORE_THRESHOLDS.C) {
        return { greenScore: 'C', reason: 'Average carbon footprint. Consider optimizing resource usage.' };
    } else if (scoreValue >= SCORE_THRESHOLDS.D) {
        return { greenScore: 'D', reason: 'High emissions and poor energy efficiency. Action is recommended.' };
    } else {
        return { greenScore: 'F', reason: 'Critical: Extremely high carbon footprint. Immediate optimization needed.' };
    }
}

/**
 * Main engine function to evaluate and generate the complete Green Score report.
 * 
 * @param {number} carbonEmission - Calculated carbon emissions
 * @param {number} carbonIntensity - Carbon intensity factor used
 * @param {number} energyEfficiency - Energy efficiency metric from dataset
 * @returns {Object} - Object containing greenScore, scoreValue, and reason
 */
function generateGreenScore(carbonEmission, carbonIntensity, energyEfficiency) {
    // 1. Validate inputs
    validateInputs(carbonEmission, carbonIntensity, energyEfficiency);

    // 2. Calculate raw numerical score
    const scoreValue = calculateScoreValue(carbonEmission, energyEfficiency);

    // 3. Determine grade and reason based on thresholds
    const { greenScore, reason } = determineGradeAndReason(scoreValue);

    // 4. Return formatted response
    return {
        greenScore,
        scoreValue,
        reason
    };
}

module.exports = {
    validateInputs,
    calculateScoreValue,
    determineGradeAndReason,
    generateGreenScore,
    SCORE_THRESHOLDS
};
