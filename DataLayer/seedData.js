const mongoose = require("mongoose");

const CloudUsage = require("./models/CloudUsage");
const CarbonMetric = require("./models/CarbonMetric");

const awsData = require("./data/awsData.json");
const azureData = require("./data/azureData.json");

const calculateCarbon = require("./utils/carbonCalculator");

mongoose.connect("YOUR_MONGODB_CONNECTION_STRING");

async function seedDatabase() {
  try {
    await CloudUsage.deleteMany({});
    await CarbonMetric.deleteMany({});

    const combinedData = [...awsData, ...azureData];

    await CloudUsage.insertMany(combinedData);

    const carbonMetrics = combinedData.map((item) => {
      const emission = calculateCarbon(item);

      let greenScore = "A";

      if (emission > 80) greenScore = "F";
      else if (emission > 60) greenScore = "D";
      else if (emission > 40) greenScore = "C";
      else if (emission > 20) greenScore = "B";

      return {
        projectId: item.projectId,
        co2Emission: emission,
        carbonIntensity: Math.round(emission / 5),
        greenScore
      };
    });

    await CarbonMetric.insertMany(carbonMetrics);

    console.log("Database Seeded Successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seedDatabase();