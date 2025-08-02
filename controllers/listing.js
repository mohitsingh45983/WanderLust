const Listing = require('../model/listing')

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({})
  res.render('listings/index.ejs', { allListings })
}

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs')
}

module.exports.createListing = async (req, res) => {
  let listing = req.body.listing
  let newListing = new Listing(listing)
  newListing.owner = req.user._id
  await newListing.save()
  req.flash('success', 'New Listing Created!')
  res.redirect('/listings')
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params
  const showListing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner')
  if (!showListing) {
    req.flash('error', 'Listing you requested for does not exist')
    return res.redirect('/listings')
  }
  res.render('listings/show.ejs', { showListing })
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist')
    return res.redirect('/listings')
  }
  res.render('listings/edit.ejs', { listing })
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  req.flash('success', 'Listing Updated!')
  res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params
  await Listing.findByIdAndDelete(id)
  req.flash('success', 'Listing Deleted!')
  res.redirect('/listings')
}
