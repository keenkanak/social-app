const express = require("express")
const User = require("../models/User")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const gravatar = require("gravatar")
const { check, validationResult } = require("express-validator")
const config = require("config")

//Test Route
router.get("/", (req, res) => res.send("User API"))

//Register User
router.post(
	"/register",
	[
		check("name").not().isEmpty(),
		check("email").isEmail(),
		check("password", "Password should be >6").isLength({ min: 5 }),
	],
	async (req, res) => {
		const { email } = req.body
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		try {
			let user = await User.findOne({ email })
			if (user) {
				return res.status(403).send("User already exists")
			}

			//User avatar
			const avatar = gravatar.url(req.body.email, {
				s: "200",
				r: "pg",
				d: "mm",
			})

			//Encrypt User Password
			const salt = await bcrypt.genSalt(10)
			userPasswordEncrypted = await bcrypt.hash(req.body.password, salt)

			//Save User
			await User.create({
				name: req.body.name,
				email: req.body.email,
				password: userPasswordEncrypted,
				avatar: avatar,
			})

			//Generate JWT
			const payload = {
				user: {
					email: req.body.email,
				},
			}

			jwt.sign(
				payload,
				config.get("jsonSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err
					res.json({
						message: `User ${req.body.email} logged in successfully`,
						token: token,
					})
				}
			)
		} catch (e) {
			res.status(500).send("User Creation failed")
		}
		res.send(`User ${req.body.name} successfully created`).status(200)
	}
)

router.post("/", function (req, res) {
	res.send("POST request to the homepage")
})

module.exports = router
