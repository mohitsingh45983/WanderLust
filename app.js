const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./model/listing.js')
const Review = require('./model/review.js')
const path = require('path')
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('./schema.js')

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

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))

app.engine('ejs', ejsMate)

app.get('/', (req, res) => {
  res.send('working')
})

// server side validation of forms
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    let errMsg = error.datails.map((el) => el.message).join(',')
    throw new ExpressError(400, errMsg)
  } else next()
}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    let errMsg = error.datails.map((el) => el.message).join(',')
    throw new ExpressError(400, errMsg)
  } else next()
}

//Index Route
app.get(
  '/listings',
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', { allListings })
  })
)

//new route
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs')
})

// create route
app.post(
  '/listings',
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = req.body.listing
    let newListing = new Listing(listing)
    await newListing.save()
    res.redirect('/listings')
  })
)

//show route
app.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const showListing = await Listing.findById(id)
    res.render('listings/show.ejs', { showListing })
  })
)

//edit route
app.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render('listings/edit.ejs', { listing })
  })
)

// update  route
app.put(
  '/listings/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
  })
)

// delete route
app.delete(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
  })
)

//Reviews
//post Route
app.post('/listings/:id/reviews', validateReview, wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review)
  listing.reviews.push(newReview)
  await newReview.save()
  await listing.save()
  res.redirect(`/listings/${listing._id}`)
}));

// Catch all unmatched routes
app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'))
})

// ERROR HANDLER — must be last
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err
  res.status(statusCode).render('listings/error.ejs', { message })
})

app.listen(8080, (req, res) => {
  console.log('Server is listening to port 8080')
})
