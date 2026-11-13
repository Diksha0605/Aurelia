
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Property = require("./models/Property");

async function inspectProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const properties = await Property.find({})
      .select("title location image")
      .sort({ location: 1 });

    console.log("Total properties:", properties.length);

    properties.forEach((property, index) => {
      console.log(`\n${index + 1}. ${property.title}`);
      console.log("Location:", property.location);
      console.log("Image:", property.image);
    });
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectProperties();
