import mongoose from "mongoose";
import { placesData } from "./placesData";
import Place from "../models/place.models";
import { config } from "../config/config";
import dns from "dns"
dns.setServers(["8.8.8.8", "4.4.8.8"])

let db = null;

const seedDB = async () => {
  try {

    // 1️⃣ Connect to MongoDB
    await mongoose.connect(config.mongoUri as string);
    console.log("✅ MongoDB Connected");

    // 2️⃣ Delete existing data
    const deleted = await Place.deleteMany({});
    console.log(`🗑 Deleted ${deleted.deletedCount} old places`);

    // 3️⃣ Insert new data
    const inserted = await Place.insertMany(placesData);
    console.log(`🌱 ${inserted.length} places seeded successfully`);

    // 4️⃣ Disconnect
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");

    process.exit(0);

  } catch (error) {

    console.error("❌ Seeding Error:", error);

    await mongoose.disconnect();
    process.exit(1);

  }
};

seedDB();