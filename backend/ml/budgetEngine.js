/**
 * GreenOps AI Dashboard - Carbon Budget Engine
 * 
 * Tracks current and forecasted carbon emissions against a predefined carbon budget.
 * Returns utilization metrics, remaining budget, and risk statuses.
 */

const THRESHOLDS = {
    WARNING: 80,  // 80% utilization
    EXCEEDED: 100 // 100% utilization
};

/**
 * Validates the budget inputs.
 * 
 * @param {number} carbonBudget - The maximum allowed carbon emission
 * @param {number} currentEmission - The current total carbon emission
 * @param {number} forecastEmission - The predicted future carbon emission
 * @returns {boolean} - true if valid, throws error otherwise
 */
function validateBudgetInputs(carbonBudget, currentEmission, forecastEmission) {
    const inputs = { carbonBudget, currentEmission, forecastEmission };

    for (const [key, value] of Object.entries(inputs)) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`Validation Error: '${key}' must be a valid number`);
        }
        if (value < 0) {
            throw new Error(`Validation Error: '${key}' cannot be negative`);
        }
    }

    if (carbonBudget === 0) {
        throw new Error(`Validation Error: 'carbonBudget' must be greater than 0 to calculate utilization`);
    }

    return true;
}

/**
 * Determines the budget status based on utilization percentage.
 * 
 * @param {number} utilizationPercentage - The percentage of budget used (0-100+)
 * @returns {string} - Status: 'Safe', 'Warning', or 'Exceeded'
 */
function determineStatus(utilizationPercentage) {
    if (utilizationPercentage > THRESHOLDS.EXCEEDED) {
        return 'Exceeded';
    } else if (utilizationPercentage >= THRESHOLDS.WARNING) {
        return 'Warning';
    } else {
        return 'Safe';
    }
}

/**
 * Evaluates the carbon budget and returns a comprehensive status report.
 * 
 * @param {number} carbonBudget - The maximum allowed carbon budget
 * @param {number} currentEmission - The current actual emissions
 * @param {number} forecastEmission - The forecasted future emissions
 * @returns {Object} - Budget report containing utilization, status, and remaining budget
 */
function evaluateBudget(carbonBudget, currentEmission, forecastEmission) {
    // 1. Validate inputs
    validateBudgetInputs(carbonBudget, currentEmission, forecastEmission);

    // 2. Calculate utilization percentage
    const utilization = (currentEmission / carbonBudget) * 100;

    // 3. Calculate remaining budget
    // If current emissions exceed the budget, remaining stops at 0.
    const remainingBudget = Math.max(0, carbonBudget - currentEmission);

    // 4. Determine status based on current utilization
    let status = determineStatus(utilization);

    // 5. Proactive Warning Logic (Hackathon Bonus)
    // If the current status is 'Safe' but the forecasted emission exceeds the budget,
    // preemptively escalate the status to 'Warning'.
    if (status === 'Safe' && forecastEmission > carbonBudget) {
        status = 'Warning'; 
    }

    // 6. Return structured output matching requirements
    return {
        budget: Number(carbonBudget.toFixed(2)),
        currentEmission: Number(currentEmission.toFixed(2)),
        forecastEmission: Number(forecastEmission.toFixed(2)),
        utilization: Number(utilization.toFixed(2)),
        remainingBudget: Number(remainingBudget.toFixed(2)),
        status: status
    };
}

module.exports = {
    validateBudgetInputs,
    determineStatus,
    evaluateBudget,
    THRESHOLDS
};
