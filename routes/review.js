const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js')
const Review = require('../model/review.js')
const Listing = require('../model/listing.js')
const { isLoggedIn , isOwner , validateReview } = require('../middleware.js')

//post Route
router.post(
  '/',
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`)
  })
)

//delete review route
router.delete(
  '/:reviewId',
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
