if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./model/user.js')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

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

const sessionOptions = {
  secret: 'mysupersecretCode',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true, // helps prevent XSS attacks
  },
}

app.get('/', (req, res) => {
  res.send('working')
})

app.use(session(sessionOptions))
app.use(flash()) //use flash before routes

// use passport after session middleware
app.use(passport.initialize())
app.use(passport.session()) //for identifying users in same session using different tabs
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currUser = req.user
  next()
})

//listings route
app.use('/listings', listingRouter)

//reviews route
app.use('/listings/:id/reviews', reviewRouter)

// user route
app.use('/', userRouter)

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
