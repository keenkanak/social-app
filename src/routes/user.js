const express = require('express')
const User = require('../models/User')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator')
const config = require('config')
const Profile = require('../models/Profile')
const auth = require('../middleware/authMiddleware')

//Get all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find()
		if (users)
			res
				.status(200)
				.json({ msg: 'Found ' + users.length + ' users', users })
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: error.message })
	}
})

//Register User
router.post(
	'/register',
	[
		check('username', 'Name required').not().isEmpty(),
		check('email', 'Email required').isEmail(),
		check('password', 'Password should be >6').isLength({ min: 5 }),
	],
	async (req, res) => {
		const { username, email } = req.body
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		try {
			let user = await User.findOne({ email })
			let usernam = await User.findOne({ username })
			if (user) {
				return res.status(403).send('User already exists')
			}
			if (usernam) {
				return res.status(403).send('Username not available')
			}

			//User avatar
			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			})

			//Encrypt User Password
			const salt = await bcrypt.genSalt(10)
			userPasswordEncrypted = await bcrypt.hash(req.body.password, salt)

			//Save User
			const newUser = new User({
				username,
				email,
				password: userPasswordEncrypted,
				avatar: avatar,
			})
			await newUser.save()

			//Generate JWT
			const payload = {
				user: {
					id: newUser.id,
				},
			}

			jwt.sign(
				payload,
				config.get('jsonSecret'),
				{ expiresIn: 3600000000000 },
				(err, token) => {
					if (err) throw err
					res
						.json({
							message: `User ${req.body.email} created successfully`,
							token: token,
						})
						.status(200)
				}
			)
		} catch (e) {
			console.log(e)
			res.status(500).send('User Creation failed')
		}
	}
)

//Delete User and profile
router.delete('/delete', auth, async (req, res) => {
	try {
		await Profile.findOneAndDelete({ user: req.user.id })
		await User.findOneAndDelete({ _id: req.user.id })
		res.json({ message: 'User and profile deleted' })
	} catch (error) {
		res.json({ msg: error.message }).status(500)
	}
})

module.exports = router
