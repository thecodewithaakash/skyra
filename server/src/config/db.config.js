import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    // return res.status(500).json({
    //   message: "Failed to connect DB",
    //   error: error.message,
    // });

    console.error("Failed to connect DB:", error.message);
    process.exit(1); // optional: stop app if DB fails
  }
};

export default connectDB;
