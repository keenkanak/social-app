const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const User = require('../models/User')
const Profile = require('../models/Profile')
const request = require('request')
const config = require('config')
const { check, validationResult } = require('express-validator')

//Get all profiles
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate({
			path: 'user',
			select: ['username', 'email', 'avatar'],
		})
		return res
			.json({ msg: 'Found ' + profiles.length + ' profiles', profiles })
			.status(200)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({ msg: error.message })
	}
})

//Get User Profile
router.get('/me', auth, async (req, res) => {
	try {
		let profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['username', 'email', 'avatar'])
		if (!profile) {
			return res.json({ msg: 'User profile does not exist', profile: null }).status(400)
		}
		res.send(profile).status(200)
	} catch (e) {
		res.json({ status: 'Failed', msg: e.message }).status(500)
	}
})

//Retrieve profile by user id
router.get('/user/:id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.id,
		}).populate({
			path: 'user',
			select: ['username', 'email', 'avatar'],
		})
		if (!profile) return res.status(400).json({ msg: 'Profile not found' })
		return res.json(profile)
	} catch (error) {
		console.error(error.message)
		if (error.kind == 'ObjectId')
			return res.status(400).json({ msg: 'Invalid ID' })
		return res.status(500).json({ msg: error.message })
	}
})

//Create or update profile
router.post(
	'/create',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills are required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.json({ errors: errors.array() }).status(400)
		}

		//Build Profile
		const profileFields = {}
		profileFields.user = req.user.id

		const {
			company,
			bio,
			status,
			location,
			githubusername,
			website,
			skills,
			youtube,
			twitter,
			instagram,
			linkedin,
			facebook,
		} = req.body

		if (company) profileFields.company = company
		if (bio) profileFields.bio = bio
		if (website) profileFields.website = website
		if (location) profileFields.location = location
		if (status) profileFields.status = status
		if (githubusername) profileFields.githubusername = githubusername

		if (skills)
			profileFields.skills = skills.split(',').map((skill) => skill.trim())

		//Build Social
		profileFields.social = {}
		if (instagram) profileFields.social.instagram = instagram
		if (facebook) profileFields.social.facebook = facebook
		if (twitter) profileFields.social.twitter = twitter
		if (linkedin) profileFields.social.linkedin = linkedin
		if (youtube) profileFields.social.youtube = youtube

		// //Build Education
		// profileFields.education = {}
		// //Build Experience
		// profileFields.experience = {}

		try {
			let profile = await Profile.findOne({ user: req.user.id })

			//Update if Profile Found
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				)
				return res.json(profile).status(200)
			}

			//If not found, create
			profile = new Profile(profileFields)
			await profile.save()
			res.json(profile).status(200)
		} catch (e) {
			console.error(e.message)
			res.status(500).json({ msg: e.message })
		}
	}
)



//Update experience
router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'title is required').not().isEmpty(),
			check('company', 'company is required').not().isEmpty(),
			check('location', 'location is required').not().isEmpty(),
			check('from', 'from date is required').not().isEmpty(),
			check('current', 'current status is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { title, company, location, from, to, current, description } =
			req.body

		const newExperience = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		}
		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.experience.unshift(newExperience)
			profile.save()
			res
				.status(200)
				.json({ msg: 'Experience updated successfully', profile })
		} catch (error) {
			console.error(error)
			res.status(400).json({ msg: error.msg })
		}
	}
)

//Delete experience
router.delete('/experience/:id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.id)
		if (removeIndex >= 0) {
			// Splice out of array
			profile.experience.splice(removeIndex, 1)
		} else {
			console.error('Invalid Index')
			res.status(400).json({ msg: 'Invalid id' })
		}
		await profile.save()
		res.json({ msg: 'Experience Deleted', profile })
	} catch (error) {
		console.error(error)
		res.status(400).json({ msg: error.message })
	}
})

//Update education
router.put(
	'/education',
	[
		auth,
		[
			check('school', 'school is required').not().isEmpty(),
			check('degree', 'degree is required').not().isEmpty(),
			check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
			check('from', 'from date is required').not().isEmpty(),
			check('current', 'current status is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body

		const newEducation = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		}
		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.education.unshift(newEducation)
			profile.save()
			res
				.status(200)
				.json({ msg: 'Education updated successfully', profile })
		} catch (error) {
			console.error(error)
			res.status(400).json({ msg: error.msg })
		}
	}
)

//Delete education
router.delete('/education/:id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.id)
		if (removeIndex >= 0) {
			// Splice out of array
			profile.education.splice(removeIndex, 1)
		} else {
			console.error('Invalid Index')
			res.status(400).json({ msg: 'Invalid id' })
		}
		await profile.save()
		res.json({ msg: 'Education Deleted', profile })
	} catch (error) {
		console.error(error)
		res.status(400).json({ msg: error.message })
	}
})

router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${req.params.username
				}/repos?per_page=5&sort=created:asc&client_id=${config.get(
					'githubClient'
				)}&client_secret=${config.get('githubClientSecret')}}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		}
		request(options, (error, response, body) => {
			if (error) console.error(error)
			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No github profile found' })
			}
			res.send(JSON.parse(body))
		})
	} catch (error) {
		console.error(error)
		res.status(400).json({ msg: error.message })
	}
})

module.exports = router
