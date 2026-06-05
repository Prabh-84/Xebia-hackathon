import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_absolute_error, mean_squared_error
import pickle
import os

print("Starting ARIMA Model Training...")

csv_path = "../../vmCloud_data.csv"

# 1. Load Data
# We only need timestamp and power_consumption for this pipeline
print("Loading dataset...")
df = pd.read_csv(csv_path, usecols=['timestamp', 'power_consumption'])

# Drop rows with missing values
df = df.dropna(subset=['timestamp', 'power_consumption'])

# 2. Compute carbonEmission
# Using the 0.475 multiplier defined in carbonEngine.js
print("Computing carbon emissions...")
df['carbonEmission'] = df['power_consumption'] * 0.475

# 3. Aggregate by day
print("Aggregating time-series data by day...")
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['date'] = df['timestamp'].dt.date
daily_emissions = df.groupby('date')['carbonEmission'].sum().reset_index()

# Sort by date just to be safe
daily_emissions = daily_emissions.sort_values('date')
daily_emissions.set_index('date', inplace=True)

# Ensure consistent daily frequency (fill missing days with interpolation or forward fill)
daily_emissions.index = pd.DatetimeIndex(daily_emissions.index)
daily_emissions = daily_emissions.asfreq('D')
daily_emissions['carbonEmission'] = daily_emissions['carbonEmission'].interpolate()

series = daily_emissions['carbonEmission'].values

print(f"Total days of data: {len(series)}")

# 4. Train/Test Split
split_idx = int(len(series) * 0.8)
train, test = series[:split_idx], series[split_idx:]
print(f"Training on {len(train)} days, testing on {len(test)} days.")

# 5. Train ARIMA Model
print("Fitting ARIMA model...")
# Using a simple order (5,1,0) for speed and reasonable baseline
model = ARIMA(train, order=(5,1,0))
model_fit = model.fit()

# 6. Evaluate Model
print("Evaluating on test set...")
predictions = model_fit.forecast(steps=len(test))

mae = mean_absolute_error(test, predictions)
rmse = np.sqrt(mean_squared_error(test, predictions))

# Calculate Trend based on the last 5 days of predictions vs previous 5 days
if len(predictions) > 10:
    recent_avg = np.mean(predictions[-5:])
    previous_avg = np.mean(predictions[-10:-5])
    if recent_avg > previous_avg * 1.05:
        trend = "increasing"
    elif recent_avg < previous_avg * 0.95:
        trend = "decreasing"
    else:
        trend = "stable"
else:
    trend = "stable"

print("\n--- EVALUATION REPORT ---")
print(f"MAE:  {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"Forecast Trend: {trend}")
print("-------------------------\n")

# 7. Save Model
model_path = "arima_model.pkl"
print(f"Saving trained model to {model_path}...")
with open(model_path, 'wb') as f:
    pickle.dump(model_fit, f)

print("Training pipeline completed successfully.")
