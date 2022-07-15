const express = require("express")
const connectDb = require("../config/db")
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

//Define Port
const PORT = process.env.PORT || 2000

//Connect Database
connectDb()

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200
}


app.use(cors(corsOptions));


//Middleware
app.use(express.json({ extended: false }))

// app.use('/api', createProxyMiddleware({ target: 'https://localhost:4000', changeOrigin: true }));


//API Routes
app.use("/api/user", require("./routes/user"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/post", require("./routes/post"))
app.use("/api/profile", require("./routes/profile"))

//Listener
app.listen(PORT, () => console.log("Server Started at " + PORT))
