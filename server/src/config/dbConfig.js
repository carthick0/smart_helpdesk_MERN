import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) {
      throw new Error("MONGO_URL not found in environment variables");
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;