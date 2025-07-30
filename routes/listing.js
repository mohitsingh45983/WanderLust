const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema } = require('../schema.js')
const Listing = require('../model/listing.js')

// server side validation of forms
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, errMsg)
  } else next()
}

//Index Route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', { allListings })
  })
)

//new route
router.get('/new', (req, res) => {
  res.render('listings/new.ejs')
})

// create route
router.post(
  '/',
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect('/listings');
  })
)

//show route
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const showListing = await Listing.findById(id).populate('reviews')
    res.render('listings/show.ejs', { showListing })
  })
)

//edit route
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render('listings/edit.ejs', { listing })
  })
)

// update  route
router.put(
  '/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
  })
)

// delete route
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
  })
)


module.exports = router;