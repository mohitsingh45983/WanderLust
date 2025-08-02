const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js')
const reviewController = require('../controllers/review.js')

const {
  isLoggedIn,
  isReviewAuthor,
  validateReview,
} = require('../middleware.js')

//post Route
router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createNewReview)
)

//delete review route
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
)

module.exports = router
