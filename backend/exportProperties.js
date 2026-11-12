
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Property = require("./models/Property");

async function exportProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    const properties = await Property.find({})
      .select("title location pricePerNight rating guests bedrooms")
      .lean();

    const outputPath = path.join(
      __dirname,
      "..",
      "ml",
      "properties.json"
    );

    fs.writeFileSync(
      outputPath,
      JSON.stringify(properties, null, 2)
    );

    console.log("Properties exported successfully!");
    console.log("Total properties:", properties.length);
    console.log("Saved at:", outputPath);
  } catch (error) {
    console.error("Export failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

exportProperties();
