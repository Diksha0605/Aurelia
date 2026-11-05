
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Property = require("./models/Property");
const Booking = require("./models/Booking");
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

app.get("/api/bookings/availability", async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.query;

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Property ID, check-in and check-out dates are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate >= endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid check-in and check-out dates",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: "confirmed",
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    res.status(200).json({
      success: true,
      available: !existingBooking,
      message: existingBooking
        ? "This property is already booked for the selected dates"
        : "This property is available!",
    });
  } catch (error) {
    console.error("Availability check error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to check property availability",
    });
  }
});


// Create a new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      propertyId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    // Validate required fields
    if (
      !propertyId ||
      !guestName ||
      !guestEmail ||
      !checkIn ||
      !checkOut ||
      guests === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all booking details",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const guestCount = Number(guests);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate >= endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out dates",
      });
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be at least 1",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (guestCount > property.guests) {
      return res.status(400).json({
        success: false,
        message: "Guest count exceeds property capacity",
      });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: "confirmed",
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "Property is already booked for these dates",
      });
    }

    // Calculate total price
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.round(
      (endDate - startDate) / millisecondsPerDay
    );

    const totalPrice = nights * property.pricePerNight;

    // Save booking in MongoDB
    const booking = await Booking.create({
      property: propertyId,
      guestName,
      guestEmail,
      checkIn: startDate,
      checkOut: endDate,
      guests: guestCount,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      data: booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
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
