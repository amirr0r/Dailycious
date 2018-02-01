const mongoose = require('mongoose')
const slug = require('slugs')

mongoose.Promise = global.Promise

const storeSchema = new mongoose.Schema({
	name: {
    type: String,
    trim: true,
    required: 'Please enter a store name !'
  },
  slug: String,
  description: {
    type: String,
    trime: true
  },
  tags: [String]
})
// I need 'this' that's why I'm not using an arrow function
// 'this' will be equals to the Store that we are trying to save
storeSchema.pre('save', function() {
  if (this.isModified('name')) {
   this.slug = slug(this.name)
  }
  next()
})

module.exports = mongoose.model('Store', storeSchema)