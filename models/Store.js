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
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  }
})
// I need 'this' that's why I'm not using an arrow function
// 'this' will be equals to the Store that we are trying to save
storeSchema.pre('save', function(next) {
  if (this.isModified('name')) {
   this.slug = slug(this.name)
  }
  next()
})

module.exports = mongoose.model('Store', storeSchema)