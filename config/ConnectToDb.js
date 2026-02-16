const mongoose = require ("mongoose")
const dotenv = require("dotenv")
const { log } = require("node:console")
dotenv.config()

const mongoUri = process.env.MONGO_URI


const connectToDb = async()=>{
    console.log("connecting.......");


    try {
        const connected = await mongoose.connect(mongoUri)

        if(connected){
            console.log("CONNECTED SUCCESSFULLY  ✅✅✅");
            
        }
    } catch (error) {
        console.log(error);
        
        
    }
    
}

module.exports = connectToDb