/**
 * GreenOps AI Dashboard - Carbon Calculation Engine
 * 
 * This engine calculates carbon emissions based on server metrics.
 * Designed to be hackathon-friendly, simple, and reusable.
 */

// Average Global Carbon Intensity Factor (kg CO2e per kWh)
// Note: In a production system, this would vary by region/cloud provider.
const DEFAULT_CARBON_INTENSITY = 0.475; 

/**
 * Validates the input dataset to ensure required fields are present and valid.
 * 
 * @param {Object} data - The metrics dataset
 * @returns {boolean} - Returns true if valid, throws error otherwise
 */
function validateMetrics(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid input: data must be an object.');
    }

    const requiredFields = [
        'cpu_usage',
        'memory_usage',
        'network_traffic',
        'power_consumption',
        'energy_efficiency'
    ];

    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw new Error(`Validation Error: Missing required field '${field}'`);
        }
        if (typeof data[field] !== 'number' || isNaN(data[field])) {
            throw new Error(`Validation Error: Field '${field}' must be a valid number`);
        }
        if (data[field] < 0) {
            throw new Error(`Validation Error: Field '${field}' cannot be negative`);
        }
    }

    return true;
}

/**
 * Calculates carbon emissions based on power consumption.
 * 
 * Formula: Carbon Emissions (kg CO2e) = Power Consumption (kWh) * Carbon Intensity (kg CO2e / kWh)
 * 
 * @param {number} powerConsumption - Power consumption in kWh
 * @param {number} [carbonIntensity=DEFAULT_CARBON_INTENSITY] - Carbon intensity factor
 * @returns {number} - Calculated carbon emissions
 */
function calculateCarbonEmissions(powerConsumption, carbonIntensity = DEFAULT_CARBON_INTENSITY) {
    return powerConsumption * carbonIntensity;
}

/**
 * Processes a complete server metrics payload and returns a comprehensive carbon analysis.
 * 
 * @param {Object} metrics - Server metrics containing power_consumption, cpu_usage, etc.
 * @returns {Object} - Processed results including calculated emissions
 */
function processMetrics(metrics) {
    // 1. Validate the incoming dataset
    validateMetrics(metrics);

    // 2. Extract relevant fields
    const { 
        cpu_usage, 
        memory_usage, 
        network_traffic, 
        power_consumption, 
        energy_efficiency 
    } = metrics;

    // 3. Calculate carbon emissions (assuming power_consumption is in kWh)
    const carbonEmissionsKgCO2e = calculateCarbonEmissions(power_consumption);

    // 4. Return processed carbon report
    return {
        timestamp: new Date().toISOString(),
        metricsProcessed: {
            cpuUsagePercent: cpu_usage,
            memoryUsageMB: memory_usage,
            networkTrafficMB: network_traffic,
            powerConsumptionKwh: power_consumption,
            energyEfficiencyScore: energy_efficiency
        },
        calculatedEmissionsKgCO2e: Number(carbonEmissionsKgCO2e.toFixed(4)),
        status: 'SUCCESS'
    };
}

module.exports = {
    validateMetrics,
    calculateCarbonEmissions,
    processMetrics,
    DEFAULT_CARBON_INTENSITY
};
