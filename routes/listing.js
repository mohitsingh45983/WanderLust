const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require('../model/listing.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')

//Index Route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', { allListings })
  })
)

//new route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('listings/new.ejs')
})

// create route
router.post(
  '/',
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = req.body.listing
    let newListing = new Listing(listing)
    newListing.owner = req.user._id
    await newListing.save()
    req.flash('success', 'New Listing Created!')
    res.redirect('/listings')
  })
)

//show route
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const showListing = await Listing.findById(id)
      .populate({ path: 'reviews', populate: { path: 'author' ,}, })
      .populate('owner')
    if (!showListing) {
      req.flash('error', 'Listing you requested for does not exist')
      return res.redirect('/listings')
    }
    res.render('listings/show.ejs', { showListing })
  })
)

//edit route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
      req.flash('error', 'Listing you requested for does not exist')
      return res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { listing })
  })
)

// update  route
router.put(
  '/:id',
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash('success', 'Listing Updated!')
    res.redirect(`/listings/${id}`)
  })
)

// delete route
router.delete(
  '/:id',
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listings')
  })
)

module.exports = router
