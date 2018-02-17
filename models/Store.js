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
  },
  photo: String
})
// I need 'this' that's why I'm not using an arrow function
// 'this' will be equals to the Store that we are trying to save
storeSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
   this.slug = slug(this.name)
   // find others stores that have a similar name
   const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$))$`, 'i')
   const similarStores = await this.constructor.find({ slug: slugRegex })
   if (similarStores.length) {
    this.slug = `${this.slug}-${similarStores.length + 1}`
   }
  }
  next()
})

module.exports = mongoose.model('Store', storeSchema)