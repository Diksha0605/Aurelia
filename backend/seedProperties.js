
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Property = require("./models/Property");

// Five individually named stays for each destination.
// The image URLs use different Unsplash photographs.
const destinations = [
  {
    location: "Manali, Himachal Pradesh",
    stays: [
      ["Pinewood Mountain Retreat", 4500, 4.9, 6, 3, "photo-1518780664697-55e3ad937233"],
      ["Snowline Cottage", 3200, 4.7, 4, 2, "photo-1510798831971-661eb04b3739"],
      ["The Himalayan Nest", 2800, 4.5, 3, 1, "photo-1449158743715-0a90ebb6d2d8"],
      ["Cedar Valley Villa", 5200, 4.8, 8, 4, "photo-1600585154340-be6161a56a0c"],
      ["Apple Orchard Homestay", 2100, 4.4, 2, 1, "photo-1600607687939-ce8a6c25118c"],
    ],
  },
  {
    location: "North Goa, Goa",
    stays: [
      ["Palm Grove Beach Villa", 5500, 4.9, 6, 3, "photo-1613490493576-7fde63acd811"],
      ["Casa de Sol", 3800, 4.7, 4, 2, "photo-1571896349842-33c89424de2d"],
      ["Seabreeze Apartment", 2900, 4.5, 3, 1, "photo-1600607687920-4e2a09cf159d"],
      ["The Coastal Hideaway", 4600, 4.8, 5, 2, "photo-1613977257363-707ba9348227"],
      ["Serene Sands Homestay", 2200, 4.3, 2, 1, "photo-1600566753086-00f18fb6b3ea"],
    ],
  },
  {
    location: "Lonavala, Maharashtra",
    stays: [
      ["Whispering Woods Villa", 4800, 4.9, 8, 4, "photo-1564013799919-ab600027ffc6"],
      ["Misty Hills Cottage", 3100, 4.6, 4, 2, "photo-1600585154526-990dced4db0d"],
      ["Valley View Residence", 3600, 4.7, 5, 2, "photo-1600210492486-724fe5c67fb0"],
      ["The Fern Retreat", 4200, 4.8, 6, 3, "photo-1600566752355-35792bedcfea"],
      ["Hilltop Budget Stay", 1900, 4.2, 2, 1, "photo-1600047509807-ba8f99d2cdde"],
    ],
  },
  {
    location: "Munnar, Kerala",
    stays: [
      ["Tea Garden Escape", 4200, 4.9, 5, 2, "photo-1448375240586-882707db888b"],
      ["Misty Morning Cottage", 3000, 4.7, 4, 2, "photo-1470770841072-f978cf4d019e"],
      ["Green Valley Retreat", 3500, 4.8, 5, 2, "photo-1600607687644-c7171b42498f"],
      ["Cloud Nine Villa", 5000, 4.9, 7, 3, "photo-1600585154340-be6161a56a0c"],
      ["Cardamom Hills Homestay", 2000, 4.4, 2, 1, "photo-1600566753190-17f0baa2a6c3"],
    ],
  },
  {
    location: "Jaipur, Rajasthan",
    stays: [
      ["Royal Courtyard Haveli", 5200, 4.9, 6, 3, "photo-1606293926075-69a00dbfde81"],
      ["Pink City Heritage Stay", 3400, 4.7, 4, 2, "photo-1600607687939-ce8a6c25118c"],
      ["Amber Palace View Suite", 3900, 4.8, 3, 2, "photo-1600210492486-724fe5c67fb0"],
      ["Rajputana Luxury Villa", 6000, 4.9, 8, 4, "photo-1600585154526-990dced4db0d"],
      ["Old City Guest House", 1800, 4.3, 2, 1, "photo-1600566753086-00f18fb6b3ea"],
    ],
  },
  {
    location: "Shimla, Himachal Pradesh",
    stays: [
      ["Pine Crest Chalet", 4300, 4.8, 6, 3, "photo-1510798831971-661eb04b3739"],
      ["The Ridge View Cottage", 3200, 4.7, 4, 2, "photo-1518780664697-55e3ad937233"],
      ["Oakwood Mountain Stay", 2800, 4.5, 3, 1, "photo-1600047509807-ba8f99d2cdde"],
      ["Snowfall Luxury Lodge", 5500, 4.9, 7, 3, "photo-1600585154340-be6161a56a0c"],
      ["Hillside Homestay", 2100, 4.4, 2, 1, "photo-1600607687644-c7171b42498f"],
    ],
  },
  {
    location: "Rishikesh, Uttarakhand",
    stays: [
      ["Ganges Riverside Retreat", 3900, 4.9, 5, 2, "photo-1470770841072-f978cf4d019e"],
      ["The Riverstone Villa", 4500, 4.8, 6, 3, "photo-1564013799919-ab600027ffc6"],
      ["Forest Edge Cottage", 2700, 4.6, 4, 2, "photo-1448375240586-882707db888b"],
      ["Mountain Breeze Residence", 3500, 4.7, 5, 2, "photo-1600566752355-35792bedcfea"],
      ["Little Buddha Homestay", 1700, 4.3, 2, 1, "photo-1600566753190-17f0baa2a6c3"],
    ],
  },
  {
    location: "Udaipur, Rajasthan",
    stays: [
      ["Lake Palace View Villa", 6500, 4.9, 8, 4, "photo-1602216056096-3b40cc0c9944"],
      ["The Aravalli Retreat", 4200, 4.8, 6, 3, "photo-1613977257363-707ba9348227"],
      ["Marigold Heritage Home", 3300, 4.7, 4, 2, "photo-1600585154526-990dced4db0d"],
      ["Lakeside Luxury Suite", 5000, 4.9, 5, 2, "photo-1600607687920-4e2a09cf159d"],
      ["Shanti Guesthouse", 1900, 4.4, 2, 1, "photo-1600566753086-00f18fb6b3ea"],
    ],
  },
];

async function seedProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    // Find only the 40 properties created by our earlier seed script.
    const oldProperties = await Property.find({
      title: {
        $regex: /^(Luxury Villa|Cozy Cottage|Modern Apartment|Mountain Retreat|Budget Homestay) \d+-\d+ in /,
      },
    });

    if (oldProperties.length !== 40) {
      throw new Error(
        `Expected 40 old sample properties, but found ${oldProperties.length}. No properties were changed.`
      );
    }

    let updatedCount = 0;

    for (const oldProperty of oldProperties) {
      const match = oldProperty.title.match(/ (\d+)-(\d+) in /);

      if (!match) continue;

      const destinationIndex = Number(match[1]) - 1;
      const stayIndex = Number(match[2]) - 1;

      const destination = destinations[destinationIndex];
      const stay = destination?.stays[stayIndex];

      if (!destination || !stay) {
        throw new Error(`Could not match old property: ${oldProperty.title}`);
      }

      const [title, price, rating, guests, bedrooms, imageId] = stay;

      await Property.updateOne(
        { _id: oldProperty._id },
        {
          $set: {
            title,
            location: destination.location,
            pricePerNight: price,
            rating,
            guests,
            bedrooms,
            image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=85`,
            description: `Enjoy ${title}, a comfortable stay in ${destination.location}. Perfect for travellers looking for a memorable getaway.`,
          },
        }
      );

      updatedCount++;
    }

    console.log("Property listings updated successfully!");
    console.log("Existing sample properties updated:", updatedCount);
    console.log("Original properties and bookings preserved.");

  } catch (error) {
    console.error("Property update failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedProperties();

