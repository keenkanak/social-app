const express = require("express")
const connectDb = require("../config/db")
const app = express()

//Define Port
const PORT = process.env.PORT || 2000

//Connect Database
connectDb()

//Middleware
app.use(express.json({ extended: false }))

//API Definition
app.get("/", (req, res) => {
	console.log("running")
	res.send("Running")
})

//API Routes
app.use("/api/user", require("./routes/user"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/post", require("./routes/post"))
app.use("/api/profile", require("./routes/profile"))

//Listener
app.listen(PORT, () => console.log("Server Started at " + PORT))
