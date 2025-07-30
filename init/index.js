const mongoose = require('mongoose')
const initData = require('./data.js')
const Listing = require('../model/listing.js')

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main()
  .then(() => {
    console.log('Connected to DB')
  })
  .catch((err) => {
    console.log(err)
  })

async function main() {
  await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '688a352e641fe0f12790a897',
  }));
  await Listing.insertMany(initData.data);
  console.log('data Was initialized');
};

initDB();
