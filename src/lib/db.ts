import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const Url = process.env.MONGOURI || '';

if (!Url) {
  throw new Error('MONGOURI is not defined in environment variables');
}

export const connectDB = async () => {
  try {
    await mongoose.connect(Url);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
