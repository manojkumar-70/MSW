// import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import Mongoose from "mongoose";
import logger from "./logger.js";
dotenv.config() ;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set. Add it to the backend .env file.");
}

const uri = mongoUri.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "");

async function connectDB() {
  try {
    // family : Use IPv4, skip trying IPv6
    await Mongoose.connect(uri, { family: 4 });
    logger.info("DB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

export default connectDB;
