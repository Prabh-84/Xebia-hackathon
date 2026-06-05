const mongoose = require("mongoose");

const cloudUsageSchema = new mongoose.Schema({
  projectId: String,
  provider: String,
  month: String,
  vmHours: Number,
  storageGB: Number,
  networkGB: Number,
  cloudCost: Number
});

module.exports = mongoose.model("CloudUsage", cloudUsageSchema);