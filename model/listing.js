const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema =  new Schema({
    title:
    {
        type: String,
        requires: true,
    },
    description:
    {
        type: String,
    },
   image: {
    filename: String,
    url: {
        type: String,
        default: "https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg",
        set: (v) =>
        v === " " ? "https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg" : v,
    }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
           type: Schema.Types.ObjectId,
           ref : "Review",
        },
    ],
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
