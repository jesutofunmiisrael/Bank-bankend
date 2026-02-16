// const jwt = require ("jsonwebtoken")

// const userModel = require("../MODEL/usermodel")
// const blacklistedTokenModel = require("../MODEL/blacklistedtoken")

// const isloggedIn = async (req, res, next) =>{
//     try {
//       let token;
      
      
//       if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         token = req.headers.authorization.split(" ")[1]
//       }


//       if(!token){
//         return res.status(403).json({
//             success:false,
//             message:"Token is required"
//         })
//       }

//     const {email} = jwt.verify(token, process.env.JWT_SECRET)

//     const isBlacklisted = await blacklistedTokenModel.findOne({token})

//     if(isBlacklisted){
//         return res.status(403).json({
//             success:false,
//             message:"Token is invalid: blacklisted"
//         })
//     }
//     const user = await userModel.findOne({email})

//     if(!user){
//         return res.status(404).json({
//         success:false,
//         message:"user not found"
//         })
//     }
// req.user = user

// next()
//     } catch (error) {
//         console.log(error);
//     if (error.message === "jwt malformed") {
//      return res.status(400).json({ success: false, message: "Token is invalid" })
//     } else if (error.message === "jwt expired") {
//      return res.status(400).json({ success: false, message: "TOken has expired. kindly login again" })
//      } else {
//             return res.status(400).json({ success: false, message: error.message || "something went wrong" })
//         }
        
//     }
// }

// module.exports = isloggedIn



const jwt = require("jsonwebtoken");
const userModel = require("../MODEL/usermodel");
const blacklistedTokenModel = require("../MODEL/blacklistedtoken");

const isloggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check blacklist
    const isBlacklisted = await blacklistedTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    // get user
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = isloggedIn;
