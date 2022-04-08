const jwt = require("jsonwebtoken")
const config = require("config")

const validate = (req, res, next) => {
	const token = req.header("x-auth-token")

	if (!token) res.status(401).json({ msg: "No auth token found." })
	try {
		const decoded = jwt.verify(token, config.get("jsonSecret"))
		req.user = decoded.user
		next()
	} catch (e) {
		res.status(401).json({ msg: "Token is not valid" })
	}
}

module.exports = validate
