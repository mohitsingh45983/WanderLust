const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review.js')

const listingSchema = new Schema({
  title: {
    type: String,
    requires: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default:
        'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg',
      set: (v) =>
        v === ' '
          ? 'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg'
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
})

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
})

const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing
