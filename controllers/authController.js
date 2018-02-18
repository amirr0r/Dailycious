const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify')
const mail = require('../handlers/mail')

exports.login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Failed Login!',
	successRedirect: '/',
	successFlash: 'You are now logged in !'
})

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'You are now logged out! 👋')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	req.flash('error', 'Oops ! You must be logged in to do that!')
	res.redirect('/login')
}

exports.forgot = async (req, res) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
		req.flash('error', 'A password reset has been mailed to you.')
		return res.redirect('/login')
	}
  // simplify that by single function 

	user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
	user.resetPasswordExpires = Date.now() + 3600000 // + 1h
	await user.save()

	const resetURL = `https://${req.headers.host}/account/reset/${user.resetPasswordToken}`
	await mail.send({
    user,
    subject: 'Password reset',
    resetURL,
    filename: 'password-reset'
  })
  req.flash('success', 'You have been emailed a password reset link!')
	res.redirect('/login')
}

const checkUserToken = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired')
    return res.redirect('/login')
  }
  return user
}

exports.reset = async (req, res) => {
  const user = await checkUserToken(req, res)
  res.render('reset', { title: 'Reset your Password' })
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    return next()
  }
  req.flash('error', 'Passwords do not match!')
  res.redirect('back')
}

exports.update = async (req, res) => {
  const user = await checkUserToken(req, res)
  const setPassword = promisify(user.setPassword, user)

  await setPassword(req.body.password)
  
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  
  const updatedUser = await user.save()
  
  await req.login(updatedUser)
  req.flash('success', '💃 Nice! Your password has been reset! You are now logged in!')
  res.redirect('/')
}