# Dataset Mapping & Analysis - GreenOps AI Dashboard

## 1. Column-by-Column Analysis & 2. Business Meaning

| Column | Data Type | Business Meaning | Relevance to GreenOps AI Dashboard |
| :--- | :--- | :--- | :--- |
| `vm_id` | String | Unique identifier for the Virtual Machine. | Fundamental for tracking emissions and assigning scores to specific resources/teams. |
| `timestamp` | Datetime | The exact time the metric was recorded. | Required for time-series forecasting, trend analysis, and budgeting over time. |
| `cpu_usage` | Float (%) | Percentage of CPU capacity currently utilized. | Primary driver of energy consumption and key metric for rightsizing recommendations. |
| `memory_usage` | Float (GB/MB) | Amount of RAM currently in use. | Used to identify over-provisioned memory resources that can be downsized. |
| `network_traffic` | Float (GB/MB) | Volume of data transferred in/out. | High network traffic implies higher energy use across network infrastructure. |
| `power_consumption` | Float (Watts) | Direct measurement of power used by the VM. | The core metric used to calculate raw carbon emissions (if provided directly). |
| `num_executed_instructions` | Integer | Total CPU instructions processed. | Useful for calculating "Useful Compute" vs "Idle Compute". |
| `execution_time` | Float (Hours/Seconds) | How long a specific task or VM has been running. | Required to convert Power (Watts) into Energy (Watt-hours or kWh). |
| `energy_efficiency` | Float | Ratio of instructions executed per watt consumed. | Direct input for the Carbon Intensity Engine and Green Score calculations. |
| `task_type` | String/Enum | Category of workload (e.g., batch, web, database). | Contextualizes recommendations (e.g., batch jobs can be delayed to greener hours). |
| `task_priority` | String/Enum | Importance of the workload (e.g., low, high, critical). | Helps determine if a workload can be safely paused or shutdown for optimization. |
| `task_status` | String/Enum | Current state (e.g., running, idle, failed). | Used to identify zombie or stuck processes wasting resources. |

*(Note: Sections 1, 2, and 3 are combined in the table above for readability.)*

---

## 4. Columns Used by Carbon Engine
- `power_consumption` (Directly converts to energy if available)
- `cpu_usage`, `memory_usage` (Proxy for power if `power_consumption` is missing)
- `execution_time` (Multiplied by power to get Energy/kWh)
- `timestamp` (For time-based tracking)

## 5. Columns Used by Green Score Engine
- `vm_id` (Entity to score)
- `cpu_usage` (Utilization efficiency)
- `energy_efficiency` (Direct scoring metric)
- `num_executed_instructions` (To measure productive work vs idle time)

## 6. Columns Used by Recommendation Engine
- `vm_id` (Target for recommendation)
- `cpu_usage`, `memory_usage`, `network_traffic` (To identify over-provisioning)
- `task_priority`, `task_type` (To determine safe recommendations, e.g., delaying low-priority batch tasks)
- `task_status` (To recommend killing stuck tasks)
- `execution_time` (To flag abnormally long-running tasks)

## 7. Columns Used by Forecast Engine
- `vm_id` (Entity forecasting)
- `timestamp` (Time-series index)
- `power_consumption` (Historical energy usage)
- `cpu_usage` (Trend of utilization growth)

## 8. Columns Used by Budget Engine
- `timestamp` (To group data by month/quarter)
- `power_consumption` / `cpu_usage` (Converted to emissions to track against the budget threshold)
- `vm_id` (To deduct from specific project budgets)

## 9. Columns Used by Copilot
- *All Columns* are accessible to the Copilot.
- Specifically relies on `vm_id`, `task_status`, `task_type`, `cpu_usage`, and derived engine outputs (Scores, Recommendations) to generate contextual insights.

---

## 10. Feature Engineering Opportunities
- **`is_zombie` (Boolean):** Created if `cpu_usage` < 5% AND `network_traffic` ~ 0 for > 72 hours.
- **`carbon_intensity_factor` (Float):** Fetched from an external grid API based on the `timestamp` and mapped region.
- **`estimated_carbon_emission` (Float):** Computed from `power_consumption` * `carbon_intensity_factor`.
- **`useful_work_ratio` (Float):** Computed as `num_executed_instructions` / `execution_time`.

## 11. Columns To Ignore For MVP
To ensure rapid development during the 4-5 hour hackathon, the following columns should be ignored initially:
- `num_executed_instructions` (Too granular for a 4-hour MVP; stick to CPU usage).
- `energy_efficiency` (We can compute a simpler proxy using CPU/Power).
- `network_traffic` (Focus strictly on compute/CPU for the initial prototype).

---

## 12. Data Cleaning Requirements
- **Timestamp Standardization:** All `timestamp` values must be converted to UTC ISO-8601 strings.
- **Negative Values:** Ensure `cpu_usage`, `memory_usage`, and `power_consumption` are strictly >= 0. Drop or clamp negative values.
- **Outliers:** Cap `cpu_usage` at 100%. If `power_consumption` shows unrealistic spikes (e.g., > 10,000W for a standard VM), apply a median filter or cap it based on known hardware limits.

## 13. Missing Value Strategy
- `power_consumption`: If missing, impute using a heuristic based on `cpu_usage` (e.g., $Power = Baseline\_Power + (Max\_Power - Baseline\_Power) * CPU\_Usage$).
- `task_priority`: If missing, default to `medium` or `normal`.
- `task_type`: If missing, default to `unknown` or `general_compute`.
- `vm_id` or `timestamp`: If either of these is missing, **DROP** the row entirely, as it cannot be tracked or forecasted.

---

## 14. MongoDB Schema Mapping

The dataset will be stored in a time-series optimized MongoDB collection called `infrastructure_metrics`.

```json
// Example Document
{
  "vm_id": "vm-prod-01",
  "timestamp": ISODate("2026-06-05T10:00:00Z"),
  "metadata": {
    "task_type": "web_server",
    "task_priority": "high"
  },
  "metrics": {
    "cpu_usage_percent": 45.2,
    "memory_usage_gb": 8.5,
    "power_consumption_watts": 120.5,
    "execution_time_hours": 1.0,
    "status": "running"
  }
}
```
*Note: We utilize MongoDB's Time Series collection feature, partitioning by `vm_id` and indexing on `timestamp`.*

---

## 15. API Field Mapping

When exposing this data via the Backend API for the Frontend Dashboard, fields should be mapped and aggregated.

**GET /api/v1/metrics/vm/{vm_id}**
```json
{
  "vmId": "vm-prod-01",
  "lastUpdated": "2026-06-05T10:00:00Z",
  "currentMetrics": {
    "cpuUtilization": 45.2,       // Mapped from cpu_usage
    "memoryUsedGb": 8.5,          // Mapped from memory_usage
    "powerDrawWatts": 120.5,      // Mapped from power_consumption
    "workloadType": "web_server", // Mapped from task_type
    "priority": "high",           // Mapped from task_priority
    "state": "running"            // Mapped from task_status
  },
  "derivedMetrics": {
    "estimatedEmissionsGrams": 48.2 // Calculated by Carbon Engine
  }
}
```
