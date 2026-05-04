import mongoose from "mongoose"
import { config } from "../config/config";
import dns from "dns"
dns.setServers(["8.8.8.8", "4.4.8.8"])

let db = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }

    process.exit(1);
  }
};

export default connectDB;