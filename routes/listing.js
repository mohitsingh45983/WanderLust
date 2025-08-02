const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const listingController = require('../controllers/listing.js')

router
  .route('/')
  //Index Route
  .get(wrapAsync(listingController.index))
  // create route
  .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing))

//new route
router.get('/new', isLoggedIn, listingController.renderNewForm)

router
  .route('/:id')
  //show route
  .get(wrapAsync(listingController.showListing))
  // update  route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

//edit route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
)

module.exports = router
