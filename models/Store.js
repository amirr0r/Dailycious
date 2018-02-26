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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
// Indexes help us to improve results from a query thanks to MongoDB
storeSchema.index({
  name: 'text',
  description: 'text'
})

storeSchema.index({ 
  location: '2dsphere' 
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

storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    // Lookup Stores and populate their reviews
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' }},
    // filter for only items that have 2 or more reviews
    { $match: { 'reviews.1': { $exists: true } } },
    // Add the average reviews field
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating' }
    } },
    // sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 }},
    // limit to at most 10
    { $limit: 10 }
  ])
}

function autopopulate(next) {
  this.populate('reviews')
  next()
}

// find reviews where the stores _id property = reviews store property
storeSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'store' // which field on the review?
})

storeSchema.pre('find', autopopulate)
storeSchema.pre('findOne', autopopulate)

module.exports = mongoose.model('Store', storeSchema)