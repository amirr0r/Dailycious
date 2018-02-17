const mongoose = require('mongoose')
const Store = mongoose.model('Store')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')
    isPhoto ? next(null, true) :
     next({ message: "That filetype isn't allowed!" }, false)
  }
}

exports.homePage = (req, res) => res.render('index')

exports.addStore = (req, res) => res.render('editStore', { title: 'Add Store' })

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
  if (req.file) {
    const extension = req.file.mimetype.split('/')[1]
    req.body.photo = `${uuid.v4()}`

    const photo = await jimp.read(req.file.buffer)
    await photo.resize(800, jimp.AUTO)
    await photo.write(`./public/uploads/${req.body.photo}`)
  }
  next()
}
// exports.createStore = (req, res) => {
//   const store = new Store(req.body)
//   store
//     .save()
//     .then(store => store ? res.redirect('/') : '')
//     .catch(err  => console.error(err))
// }

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save()
  req.flash('success', `Successfully created <strong>${store.name}</strong>. Care to leave a review ?`)
  res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
  const stores = await Store.find()
  res.render('stores', { title: 'Stores', stores })
}

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id })
  // 2. confirm they are the owner of the store
  // TODO
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
  // find an update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true, // forced our models to run its required validators
  }).exec()
  //Redirect them to the store and tell them it worked
  req.flash('success', `Successfully updated <strong>${store.name}</strong>.
    <a href="/stores/${store.slug}">View store →</a>`)
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug })
  if (store) {
    res.render('store', { store, title: store.name })
  }
  next()
}

exports.getStoresByTag = async (req, res) => {
  const category = req.params.tag
  const tagsPromise = Store.getTagsList()
  const storesPromises = Store.find({ tags: category})

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise])
  
  res.render('tag', { tags, title: 'Tags', category, stores })
}