const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('slugs')

mongoose.Promise = global.Promise

const storeSchema = new Schema({
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
  photo: String, 
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author!'
  }
})

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

// 'statics' allows us to add a method to the schema
storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

module.exports = mongoose.model('Store', storeSchema)