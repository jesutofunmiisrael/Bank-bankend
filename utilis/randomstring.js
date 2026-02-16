const crypto = require("crypto")


const generateString = (num=6) =>{
const string = crypto.randomBytes(num).toString("hex")
return string
}

module.exports = generateString