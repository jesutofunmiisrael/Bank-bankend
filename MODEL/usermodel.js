const mongoose = require ("mongoose")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { type } = require("os")


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },


    email:{
        type:String,
        require:true,
        unique:true
    },

    password:{
  type:String,
        require:true,
        minLength:6,
        select:false
    },


    
  balance: {
    type: Number,
    default: 5000000
  },

  accountNumber: {
    type: String,
    unique: true,
    required:true
  },

    resetPasswordToken: {
    type: String
  },

  resetPasswordExpires: {
    type: Date
  }

})


const userModel = mongoose.model("user", userSchema)

module.exports = userModel

