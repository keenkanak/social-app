const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const User = require("../models/User")
const Profile = require("../models/Profile")

//Get User Profile
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.email }).populate({
			path: "user",
			select: ["name", "avatar"],
		})
		if (!profile) {
			return res.json({ msg: "User profile does not exist" }).status(400)
		}
		res.json(profile).status(200)
	} catch (e) {
		res.json({ msg: e.message }).status(500)
	}
})

module.exports = router
