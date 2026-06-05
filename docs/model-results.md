# GreenOps AI Forecasting Model Documentation

## Architecture & Integration
The AI Forecasting Model is a true Machine Learning pipeline built using Python and the `statsmodels` library. It bridges into the Node.js backend via a dedicated `forecastModel.js` CommonJS integration wrapper, ensuring zero overhead on the primary web server while delivering true predictive analytics.

## Dataset & Features
- **Dataset**: `vmCloud_data.csv` (1.8M+ rows)
- **Features Extracted**: `timestamp`, `power_consumption`
- **Target Variable**: `carbonEmission`
- **Carbon Calculation Formula**: 
  `carbonEmission = power_consumption * 0.475` 
  *(Assumes 0.475 kg CO2e per unit of power consumption)*

## Data Pipeline
To train a reliable Time Series model, the high-frequency cloud metrics were aggregated into a continuous daily frequency:
- **First Date**: `2023-01-01`
- **Last Date**: `2023-07-20`
- **Total Unique Days**: `201 days` 
*(This ~6.5 month baseline provides a solid foundation for ARIMA, avoiding the weakness of short 30-day training sets).*

## Model Configuration & Training
- **Model Type**: ARIMA (AutoRegressive Integrated Moving Average)
- **Parameters (p,d,q)**: `(5, 1, 0)`
  - *p=5*: Uses the past 5 days to predict the next day.
  - *d=1*: First-order differencing applied to make the time-series stationary.
  - *q=0*: No moving average component.
- **Train/Test Split**: 80% / 20%
- **Training Set Size**: 160 days *(Model was fit strictly on this data to prevent leakage)*
- **Testing Set Size**: 41 days *(Model evaluation was strictly performed on this unseen holdout set)*

## Evaluation Metrics
The model was tested against the 41-day holdout set to simulate real-world forecasting accuracy:
- **Mean Absolute Error (MAE)**: `21,379.76`
- **Mean Absolute Percentage Error (MAPE)**: `3.38%`
- **Root Mean Squared Error (RMSE)**: `74,486.47`
- **Forecast Horizon**: 30 Days

*Note: With daily aggregate emissions averaging ~960,000 kg CO2e, a MAE of ~21K represents an approximate ~2.2% error margin, demonstrating strong predictive capabilities for hackathon standards.*

## Limitations & Future Improvements
1. **Univariate Limitation**: ARIMA only looks at past emissions to predict future emissions. It cannot account for external variables (e.g., unexpected marketing campaigns driving a spike in traffic).
2. **Future Improvement**: Upgrade to **SARIMAX** (Seasonal ARIMA with eXogenous variables) to feed `cpu_usage` and `network_traffic` directly into the model alongside emissions, allowing the model to predict carbon spikes based on leading traffic indicators.
3. **Hyperparameter Tuning**: Implement grid-search (`pmdarima.auto_arima`) to dynamically find the optimal `(p,d,q)` parameters for the specific infrastructure workload instead of a static `(5,1,0)`.
