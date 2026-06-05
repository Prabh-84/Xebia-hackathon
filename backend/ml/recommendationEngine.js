/**
 * GreenOps AI Dashboard - Recommendation Engine
 * 
 * Generates actionable, rule-based recommendations to optimize 
 * cloud infrastructure based on telemetry data and Green Scores.
 */

// Cost estimation constant: Assumed price per kWh in USD
const COST_PER_KWH = 0.12; 

/**
 * Validates the inputs required for generating recommendations.
 * 
 * @param {Object} metrics - Infrastructure and emissions metrics
 * @returns {boolean} - true if valid, throws error otherwise
 */
function validateMetrics(metrics) {
    const requiredNumbers = ['cpu_usage', 'memory_usage', 'power_consumption', 'energy_efficiency', 'carbonEmission'];
    
    for (const field of requiredNumbers) {
        if (typeof metrics[field] !== 'number' || isNaN(metrics[field])) {
            throw new Error(`Validation Error: '${field}' must be a valid number`);
        }
    }

    if (!metrics.greenScore || typeof metrics.greenScore !== 'string') {
        throw new Error(`Validation Error: 'greenScore' must be a valid string grade`);
    }

    return true;
}

/**
 * Generates an array of structured recommendations based on heuristic rules.
 * 
 * @param {Object} metrics - Includes cpu_usage, memory_usage, power_consumption, 
 *                           energy_efficiency, greenScore, carbonEmission, etc.
 * @returns {Array<Object>} - List of structured recommendation objects
 */
function generateRecommendations(metrics) {
    // 1. Validate incoming data
    validateMetrics(metrics);
    
    const {
        cpu_usage,
        memory_usage,
        power_consumption,
        energy_efficiency,
        greenScore,
        carbonEmission,
        forecast
    } = metrics;

    const recommendations = [];

    // Rule 1: Zombie / Idle Server Mitigation
    // Based on dataset: average CPU is 50%. < 15% is extremely low utilization.
    if (cpu_usage < 15 && power_consumption > 150) {
        recommendations.push({
            title: "Decommission or Hibernate Idle Instances",
            description: "Instance shows minimal CPU usage but high power consumption. Consider hibernating during off-hours or terminating if unused.",
            priority: "High",
            expectedCarbonReduction: Number((carbonEmission * 0.8).toFixed(2)), // 80% reduction
            expectedCostReduction: Number((power_consumption * 0.8 * COST_PER_KWH).toFixed(2))
        });
    }

    // Rule 2: Migrate to High-Efficiency Hardware
    // Based on dataset: average efficiency is 0.5. Anything below 0.3 is notably poor.
    if (energy_efficiency < 0.3) {
        recommendations.push({
            title: "Migrate to Greener Infrastructure",
            description: "Current energy efficiency is critically low. Migrating this workload to newer ARM-based processors or a greener cloud region can drastically improve efficiency.",
            priority: "High",
            expectedCarbonReduction: Number((carbonEmission * 0.4).toFixed(2)), // Estimated 40% reduction
            expectedCostReduction: Number((power_consumption * 0.3 * COST_PER_KWH).toFixed(2))
        });
    }

    // Rule 3: Right-Size Compute (Over-utilized CPU)
    // CPU constantly pegged near 100% causes thermal inefficiencies and throttling
    if (cpu_usage > 95) {
        recommendations.push({
            title: "Right-Size Compute Resources",
            description: "CPU is consistently bottlenecked, forcing cooling overhead and thermal throttling. Upgrading to a slightly larger instance might optimize total power draw per instruction.",
            priority: "Medium",
            expectedCarbonReduction: Number((carbonEmission * 0.1).toFixed(2)),
            expectedCostReduction: 0 // Cost reduction is 0 because upgrades cost more, but it helps sustainability/performance
        });
    }

    // Rule 4: Memory Leak / Bloat Optimization
    // High memory but low CPU suggests memory-heavy or leaking app
    if (memory_usage > 90 && cpu_usage < 30) {
        recommendations.push({
            title: "Investigate Memory Bloat",
            description: "High memory utilization with low CPU activity suggests a potential memory leak or unoptimized caching. Resolving this allows scaling down to a smaller instance.",
            priority: "Medium",
            expectedCarbonReduction: Number((carbonEmission * 0.15).toFixed(2)),
            expectedCostReduction: Number((power_consumption * 0.15 * COST_PER_KWH).toFixed(2))
        });
    }

    // Rule 5: Catch-all for Failing Grades (if no other rule caught it)
    if ((greenScore === 'D' || greenScore === 'F') && recommendations.length === 0) {
        recommendations.push({
            title: "Comprehensive Workload Audit",
            description: "This instance received a failing Green Score but doesn't map to standard anti-patterns. A manual architecture review is highly recommended.",
            priority: "High",
            expectedCarbonReduction: Number((carbonEmission * 0.25).toFixed(2)),
            expectedCostReduction: Number((power_consumption * 0.25 * COST_PER_KWH).toFixed(2))
        });
    }

    // Rule 6: Forecast indicates rising emissions
    if (forecast && forecast.trend === 'increasing') {
        recommendations.push({
            title: "Proactive ML Forecast Alert",
            description: "The AI forecasting model predicts an upward trend in carbon emissions over the next 30 days. Proactively investigate workloads to prevent budget overrun.",
            priority: "High",
            expectedCarbonReduction: Number((carbonEmission * 0.1).toFixed(2)),
            expectedCostReduction: Number((power_consumption * 0.1 * COST_PER_KWH).toFixed(2))
        });
    }

    // Default: Perfect infrastructure
    if (recommendations.length === 0) {
        recommendations.push({
            title: "Maintain Current Infrastructure",
            description: "Instance is operating within optimal green parameters. No immediate action required.",
            priority: "Low",
            expectedCarbonReduction: 0,
            expectedCostReduction: 0
        });
    }

    return recommendations;
}

module.exports = {
    validateMetrics,
    generateRecommendations,
    COST_PER_KWH
};
