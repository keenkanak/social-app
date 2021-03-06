const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

//Test
//Get Logged in User Details
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select(
			'-password'
		)
		res.json(user).status(200)
	} catch (e) {
		res.status(500).json({ msg: 'Server error' })
	}
})

//User login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (!user) {
			return res
				.status(400)
				.json({ message: `User ${req.body.email} does not exist` })
				.send()

		}
		const isMatch = await bcrypt.compare(req.body.password, user.password)
		if (!isMatch) {
			res.status(401).json({ message: 'Invalid Password' })
		}

		const payload = {
			user: {
				id: user.id,
			},
		}
		jwt.sign(
			payload,
			config.get('jsonSecret'),
			{ expiresIn: 36000000 },
			(err, token) => {
				if (err) throw err
				res.json({
					message: `User ${user.email} logged in successfully`,
					token: token,
				})
			}
		)
	} catch (e) {
		res.status(500).json({ message: e.message })
	}
})

module.exports = router
