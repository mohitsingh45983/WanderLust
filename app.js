const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./model/listing.js')
const path = require('path')
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  })

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine('ejs',ejsMate);

app.get('/', (req, res) => {
  res.send('working')
})

//Index Route
app.get('/listings', async (req, res) => {
  const allListings = await Listing.find({})
  res.render('listings/index.ejs', { allListings })
});

//new route
app.get("/listings/new",(req,res) => {
  res.render("listings/new.ejs");
});

// create route 
app.post("/listings",async (req,res) => {
    let listing = req.body.listing; 
    let newListing = new Listing(listing);
    await newListing.save(); 
    res.redirect("/listings"); 
});

//show route
app.get('/listings/:id', async (req, res) => {
  let {id} = req.params;
  const showListing = await Listing.findById(id);
  res.render('listings/show.ejs', { showListing })
});



//edit route
app.get('/listings/:id/edit', async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing })
});

// update  route 
app.put("/listings/:id",async(req,res) =>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});

// delete route 
app.delete("/listings/:id",async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings"); 
});

app.listen(8080, (req, res) => {
  console.log('Server is listening to port 8080')
})
