const express = require('express')

const app = express();

const PORT = process.env.PORT || 2003

app.get('/',(req,res)=>{
    console.log("running");
    res.send("Running")
})
app.listen(PORT,()=>console.log("Server Started at " + PORT));