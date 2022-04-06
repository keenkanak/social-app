const express = require('express')
const connectDb = require('../config/db')
const app = express();


//Define Port
const PORT = process.env.PORT || 2003


//Connect Database
connectDb()


//API Definition
app.get('/',(req,res)=>{
    console.log("running");
    res.send("Running")
})




//Listener
app.listen(PORT,()=>console.log("Server Started at " + PORT));