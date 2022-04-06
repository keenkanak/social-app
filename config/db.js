const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoURI')

const connectDb = async ()=>{
    try{
        await mongoose.connect(db,{
            useNewUrlParser:true
        })
        console.log("MongoDB connected")
    }catch(e){
        console.log("MongoDB connection failed")
        console.log(e.message)
        process.exit(1)
    }

}

module.exports = connectDb