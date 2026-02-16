 const express = require("express")
const {signup, login, forgetPassword, resetPassword, logout} = require("../CONTROLLER/authcontroller")



 const authrouter = express.Router()

 authrouter.post("/signup", signup)
  authrouter.post("/login", login)
  authrouter.post("/forget", forgetPassword)
authrouter.post("/reset", resetPassword)
authrouter.post("/logout", logout)




 module.exports= authrouter