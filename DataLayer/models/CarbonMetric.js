const mongoose = require("mongoose");

const carbonMetricSchema = new mongoose.Schema({
  projectId: String,
  co2Emission: Number,
  carbonIntensity: Number,
  greenScore: String
});

module.exports = mongoose.model("CarbonMetric", carbonMetricSchema);