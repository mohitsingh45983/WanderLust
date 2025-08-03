const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const listingController = require('../controllers/listing.js')
const multer = require('multer') //for image upload
const { storage } = require('../cloudConfig.js') //cloud dest. of image
const upload = multer({ storage })

router
  .route('/')
  //Index Route
  .get(wrapAsync(listingController.index))
  // create route
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
  )

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
    upload.single('listing[image]'),
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
