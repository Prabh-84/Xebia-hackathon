const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");
    console.log(conn.connection.host);
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);
  }
};

module.exports = connectDB;