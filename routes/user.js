const express = require('express')
const router = express.Router()
const User = require('../model/user.js')
const wrapAsync = require('../utils/wrapAsync.js')

router.get('/signup', (req, res) => {
  res.render('users/signup.ejs')
})

router.post(
  '/signup',
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        username: username,
        email: email,
      });
      await User.register(newUser, password);
      req.flash("success","Welcome to WanderLust!");
      res.redirect('/listings')
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
  })
);

module.exports = router
