
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Property = require("./models/Property");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Aurelia backend is running!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// Get all properties


app.get("/api/properties", async (req, res) => {
  try {
    const { destination, guests, maxPrice } = req.query;
    const filter = {};

    // 1. Filter by destination
    if (destination && destination.trim()) {
      filter.$or = [
        {
          title: {
            $regex: destination.trim(),
            $options: "i",
          },
        },
        {
          location: {
            $regex: destination.trim(),
            $options: "i",
          },
        },
      ];
    }

    // 2. Filter by guest capacity
    if (guests !== undefined) {
      const guestCount = Number(guests);

      if (!Number.isInteger(guestCount) || guestCount < 1) {
        return res.status(400).json({
          success: false,
          message: "Guests must be a positive integer",
        });
      }

      filter.guests = { $gte: guestCount };
    }

    // 3. Filter by maximum price per night
    if (maxPrice !== undefined) {
      const priceLimit = Number(maxPrice);

      if (!Number.isFinite(priceLimit) || priceLimit < 1) {
        return res.status(400).json({
          success: false,
          message: "Maximum price must be a positive number",
        });
      }

      filter.pricePerNight = { $lte: priceLimit };
    }

    const properties = await Property.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
});


 // Add a new property
app.post("/api/properties", async (req, res) => {
  try {
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: "Property added successfully!",
      data: property,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `Aurelia backend running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
