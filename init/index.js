const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../model/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Mapping location to coordinates
const geoMap = {
  'Malibu': [-118.7997, 34.0259],
  'New York City': [-74.006, 40.7128],
  'Aspen': [-106.837, 39.1911],
  'Florence': [11.2558, 43.7696],
  'Portland': [-122.6765, 45.5231],
  'Cancun': [-86.8515, 21.1619],
  'Lake Tahoe': [-120.0433, 39.0968],
  'Los Angeles': [-118.2437, 34.0522],
  'Verbier': [7.2333, 46.1],
  'Serengeti National Park': [34.6857, -2.3333],
  'Amsterdam': [4.9041, 52.3676],
  'Fiji': [179.4144, -16.5782],
  'Cotswolds': [-1.8433, 51.833],
  'Boston': [-71.0589, 42.3601],
  'Bali': [115.1889, -8.4095],
  'Banff': [-115.572, 51.1784],
  'Miami': [-80.1918, 25.7617],
  'Phuket': [98.3903, 7.8804],
  'Scottish Highlands': [-4.2026, 57.12],
  'Dubai': [55.2708, 25.2048],
};

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '688a352e641fe0f12790a897',
    geometry: {
      type: 'Point',
      coordinates: geoMap[obj.location] || [-74.006, 40.7128], // Default to NYC if location not found
    },
  }));

  await Listing.insertMany(initData.data);
  console.log('Data was initialized');
};

initDB();
