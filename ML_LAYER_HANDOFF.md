# ML Layer Handoff

This file is a formal handoff for the ML components.

## To: Prabhjot (Backend/DevOps)
All ML components have been isolated into `backend/ml/`. They are written in clean CommonJS without external dependencies.
You can directly `require()` these files in your Express/Node.js backend.
See `docs/ml-api-contracts.md` for function signatures.

## To: Nandan (Frontend)
The backend routes that wrap these ML engines will return structured JSON.
- **Recommendations**: Expect an array of objects containing `title`, `description`, `priority`, and `expectedCarbonReduction`.
- **Forecasts**: Expect `{ predictedEmission, trend }` objects.
- **Budget**: Expect a strict status of `Safe`, `Warning`, or `Exceeded`.
- **Copilot**: Pass the raw text string returned by the backend directly into the UI chat bubble.

## Layer Status
- **Status**: Code complete.
- **Validation**: Syntax checked.
- **External Dependencies**: None.

---

> [!WARNING]
> ## Deployment Requirement (Important for DevOps)
> The `forecastModel.js` utilizes a child process to run a real Machine Learning ARIMA model in Python. **Your deployment target (e.g., Render, Railway, EC2) MUST have Python 3 and pip installed.**
> If you are using a pure Node.js buildpack, the ML forecasting endpoint will fail. Please ensure a multi-buildpack configuration (Node + Python).

> [!TIP]
> ## API Contract Clarification (Recommendations)
> The `generateRecommendations(metrics)` signature has **not** changed and is fully backward-compatible. However, you can now *optionally* include a `forecast` object inside the `metrics` payload. If provided, the engine will dynamically generate proactive budget alerts based on AI trends. If omitted, the engine falls back to standard heuristic rules.
