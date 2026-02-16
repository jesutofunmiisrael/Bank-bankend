const userModel = require("../MODEL/usermodel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const generateString = require("../utilis/randomstring")
const SendEmail = require("../maintemplate/sendotp")
const crypto = require("crypto")
const blacklistedTokenModel = require("../MODEL/blacklistedtoken")

const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = generateString(8);
    const verificationExp = Date.now() + 1000 * 60 * 10;

    const accountNumber = generateAccountNumber();

 const user = await userModel.create({
  name,
  email,
  password: hashedPassword,
  accountNumber,
  balance: 500000,        
  verificationToken,
  verificationExp
});

       const token = jwt.sign(
        {email, id: user._id},
        process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXP }
    );
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Signup unsuccessful ❌"
      });
    }



res.status(201).json({
  success: true,
  message: "Signup successful ✅",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    accountNumber: user.accountNumber,
    balance: user.balance
  }
});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error ❌"
    });
  }
};



const login = async (req, res) =>{
    const {password, email} = req.body;

    try {
    const user = await userModel.findOne({email}).select(" +password");

    if(!user || !(await bcrypt.compare(password,user.password))){
        return res.status(401).json({
            sucess:false,
            message: "Email or password is incorrect ❌"
        })
    }

    const token = jwt.sign(
        {email, id: user._id},
        process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXP }
    );
    
  res.status(200).json({
    success: true,
    token,
    user: {
        id: user._id,
        name: user.name,        
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance || 500000  
    },
    message: "Login successful ✅"
});

        
    } catch (error) {
        console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error ❌"
    });
    }
}



const forgetPassword = async (req, res) => {
    const {email} = req.body


    try {
       const user = await userModel.findOne({email}) 

       if(!user){
        return res.status(404).json({
            success:false,
            message:"this email does not exist ❌ "
        })
       }

       const otp = Math.floor(100000 + Math.random () * 900000).toString();
       console.log(otp);
       
       const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

       user.resetPasswordToken = hashedOtp;
       user.resetPasswordExpires = Date.now() +10 * 60 *1000;
       await user.save();

       const sendmail = SendEmail(user.name, user.email,otp)
       res.status(200).json({
        success:true,
        message:"OTP SENT TO   ✅✅✅",
         otp
       });
         
       
    } catch (error) {
    console.log(error);
    
    }
}

const resetPassword = async (req, res) =>{
 const {email, otp, newpassword} = req.body;

 if(!otp || !newpassword || !email){
    return res.status(400).json({
        success:false,
        message:"Missing required fieids(email, otp, ornewPassword )"
    })
 }

 try {
    const hashedOtp = crypto.createHash("sha256").update(otp.toString()).digest("hex");
    const user = await userModel.findOne({
        email,
        resetPasswordToken:hashedOtp,
        resetPasswordExpires:{ $gt: Date.now() }
    });
       if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
        
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt)

    user.password = hashedPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful ✅",
    });


 } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error resetting password",
    })
 }


}



const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(400).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        await blacklistedTokenModel.create({ token });

        return res.status(200).json({
            success: true,
            message: "Logout successfully",
            token,
        
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


module.exports = {signup, login, forgetPassword, resetPassword, logout}