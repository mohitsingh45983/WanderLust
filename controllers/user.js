const User = require('../model/user.js')

module.exports.renderSignUpForm = (req, res) => {
  res.render('users/signup.ejs')
}

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body
    const newUser = new User({
      username: username,
      email: email,
    })
    const registeredUser = await User.register(newUser, password)
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'Welcome to WanderLust!')
      res.redirect('/listings')
    })
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/signup')
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs')
}

module.exports.login = async (req, res) => {
  req.flash('success', 'Welcome back to WanderLust!')
  let redirectUrl = res.locals.redirectUrl || '/listings'
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.flash('success', 'You are logged out successfully!')
    res.redirect('/listings')
  })
}
