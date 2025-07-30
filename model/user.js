const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose') //It has multiple methods also
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
})

// automatically implement username,hashing,salting of passwords
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)
