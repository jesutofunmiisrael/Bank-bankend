const express = require("express")
const isloggedIn = require("../middleware/isloggedin")
const {getMe, getBalance, transferMoney,  depositeMoney, withdrawMoney, getHistory, getCurrentUser, getUserProfile,} = require("../CONTROLLER/Bankcontroller")

const bankrouter = express.Router()

bankrouter.get("/me", isloggedIn, getMe)

bankrouter.get("/get", isloggedIn,  getBalance)
bankrouter.post("/transfer", isloggedIn, transferMoney)
bankrouter.get("/history", isloggedIn, getHistory)
bankrouter.post("/deposit", isloggedIn, depositeMoney)
bankrouter.post("/withdraw", isloggedIn, withdrawMoney)

bankrouter.get("/profile", isloggedIn, getUserProfile)
module.exports = bankrouter