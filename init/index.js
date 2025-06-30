const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_URL);
}

const locationsCoordinates = {
  Malibu: [-118.7798, 34.0259],
  "New York City": [-74.006, 40.7128],
  Aspen: [-106.8245, 39.1911],
  Florence: [11.2558, 43.7696],
  Portland: [-122.6765, 45.5231],
  Cancun: [-86.8515, 21.1619],
  "Lake Tahoe": [-120.0324, 39.0968],
  "Los Angeles": [-118.2437, 34.0522],
  Verbier: [7.2266, 46.0958],
  "Serengeti National Park": [34.6857, -2.3333],
  Amsterdam: [4.9041, 52.3676],
  Fiji: [178.065, -17.7134],
  Cotswolds: [-1.7836, 51.8333],
};

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    // Add owner and geometry with coordinates to each listing
    initData.data = initData.data.map(obj => ({
      ...obj,
      owner: "685a3a219c59b49c230bcffa",
      geometry: {
        type: "Point",
        coordinates: locationsCoordinates[obj.location] || [0, 0],
      },
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

 initDB();
