import sys
import pickle
import json
import numpy as np

import os

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "arima_model.pkl")

try:
    with open(model_path, 'rb') as f:
        model_fit = pickle.load(f)
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

steps = 30
if len(sys.argv) > 1:
    try:
        steps = int(sys.argv[1])
    except ValueError:
        pass

# Generate forecast
forecast_values = model_fit.forecast(steps=steps).tolist()

# Determine trend based on predictions
if len(forecast_values) >= 10:
    recent_avg = np.mean(forecast_values[-5:])
    previous_avg = np.mean(forecast_values[:5])
    if recent_avg > previous_avg * 1.05:
        trend = "increasing"
    elif recent_avg < previous_avg * 0.95:
        trend = "decreasing"
    else:
        trend = "stable"
else:
    trend = "stable"

# Calculate basic stats for the frontend
start_val = forecast_values[0]
end_val = forecast_values[-1]
growth_rate = (end_val - start_val) / start_val if start_val > 0 else 0

result = {
    "currentEmission": round(start_val, 4),
    "predictedEmission": round(end_val, 4),
    "growthRate": round(growth_rate, 4),
    "forecastWindow": steps,
    "trend": trend,
    "forecastSequence": [round(x, 4) for x in forecast_values]
}

print(json.dumps(result))
