/**
 * GreenOps AI Dashboard - Copilot Engine
 * 
 * A lightweight, rule-based sustainability assistant that parses telemetry 
 * and recommendation data to simulate AI chatbot responses.
 * 
 * Specifically designed for hackathons: zero external API calls, instantaneous 
 * responses, and highly deterministic human-readable text.
 */

// Define standard supported query types for the Copilot
const SUPPORTED_QUERIES = {
    WHY_SCORE_LOW: 'Why is my Green Score low?',
    WHY_EMISSIONS_INC: 'Why are emissions increasing?',
    HOW_TO_REDUCE: 'How can I reduce emissions?',
    BIGGEST_RISK: 'What is my biggest risk?',
    SUMMARY: 'Show optimization summary.'
};

/**
 * Validates the telemetry inputs provided to the Copilot context.
 * 
 * @param {Object} context - The environmental context containing score, forecast, etc.
 * @returns {boolean} - true if valid, throws error otherwise
 */
function validateContext(context) {
    if (!context || typeof context !== 'object') {
        throw new Error('Validation Error: context must be an object');
    }

    const requiredFields = ['greenScore', 'carbonEmission', 'recommendations', 'forecast', 'budgetStatus'];
    for (const field of requiredFields) {
        if (context[field] === undefined) {
            throw new Error(`Validation Error: context is missing required field '${field}'`);
        }
    }

    return true;
}

/**
 * Generates a human-readable response based on the query and context data.
 * 
 * @param {string} query - The user's question (should match SUPPORTED_QUERIES)
 * @param {Object} context - Environmental context (greenScore, carbonEmission, recommendations, forecast, budgetStatus)
 * @returns {string} - Human-readable chatbot response
 */
function generateCopilotResponse(query, context) {
    // 1. Validate Context
    validateContext(context);

    const {
        greenScore,
        carbonEmission,
        carbonIntensity,
        recommendations,
        forecast,
        budgetStatus
    } = context;

    // 2. Route the query to the appropriate rule-based logic
    switch (query) {

        case SUPPORTED_QUERIES.WHY_SCORE_LOW:
            if (greenScore === 'A' || greenScore === 'B') {
                return `Your Green Score is actually quite good (${greenScore}). You are operating efficiently!`;
            } else if (recommendations && recommendations.length > 0) {
                // Pick the first recommendation (usually the highest priority) to explain the score
                const topRec = recommendations[0];
                return `Your score is ${greenScore} primarily because of infrastructure inefficiencies. Specifically, I flagged: "${topRec.title}". Addressing this will immediately improve your score.`;
            } else {
                return `Your score is ${greenScore} due to above-average absolute carbon emissions (${carbonEmission.toFixed(2)} kg CO2e) compared to your hardware's baseline capability.`;
            }

        case SUPPORTED_QUERIES.WHY_EMISSIONS_INC:
            if (forecast.trend === 'decreasing' || forecast.trend === 'stable') {
                return `Looking at the data, your emissions are actually ${forecast.trend}, not increasing. Your forecasted growth rate is ${(forecast.growthRate * 100).toFixed(2)}%.`;
            } else {
                return `Your emissions are trending upwards at a compound growth rate of ${(forecast.growthRate * 100).toFixed(2)}%. This typically happens when user traffic scales up without auto-scaling guardrails, or due to unoptimized code deploying into production.`;
            }

        case SUPPORTED_QUERIES.HOW_TO_REDUCE:
            if (!recommendations || recommendations.length === 0 || recommendations[0].priority === 'Low') {
                return `Your infrastructure is currently highly optimized. Maintain your current setup and continue monitoring.`;
            }
            // List the top recommendations dynamically
            const recTitles = recommendations.slice(0, 2).map(r => r.title).join(" and ");
            let response = `To reduce emissions, you should focus on: ${recTitles}.`;
            if (recommendations[0].expectedCarbonReduction) {
                response += ` Implementing the top recommendation alone could save approximately ${recommendations[0].expectedCarbonReduction} kg CO2e.`;
            }
            return response;

        case SUPPORTED_QUERIES.BIGGEST_RISK:
            if (budgetStatus === 'Exceeded') {
                return `CRITICAL RISK: You have already exceeded your total carbon budget! Immediate intervention is required to pause non-essential workloads.`;
            } else if (budgetStatus === 'Warning') {
                return `Your biggest risk is budget exhaustion. You are currently in a 'Warning' state. If you do not optimize your workloads, you will blow past your sustainability allowance.`;
            } else if (forecast.trend === 'increasing') {
                return `Your carbon budget is safe for now, but your biggest risk is your ${forecast.trend} emission trend. If this trajectory continues, you will run out of budget faster than anticipated.`;
            } else {
                return `Currently, there are no immediate critical risks. Your budget is Safe and emissions are well under control. Keep up the good work!`;
            }

        case SUPPORTED_QUERIES.SUMMARY:
            const statusSummary = budgetStatus === 'Safe' ? 'under budget' : 'at risk of budget exhaustion';
            return `Optimization Summary: Your current Green Score is ${greenScore} and you are emitting ${carbonEmission.toFixed(2)} kg CO2e. You are currently ${statusSummary}. I have identified ${recommendations ? recommendations.length : 0} actionable steps to further improve your sustainability posture.`;

        default:
            return `I'm sorry, I don't understand that question. Try asking something like: "${SUPPORTED_QUERIES.HOW_TO_REDUCE}"`;
    }
}

module.exports = {
    SUPPORTED_QUERIES,
    validateContext,
    generateCopilotResponse
};
