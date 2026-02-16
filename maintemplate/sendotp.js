const transporter = require("../config/nodemailer")

const SendEmail = async(name,email,otp) =>{
    try {
 if(!email) return console.error("❌  No recipient email provided!");

 const info = await transporter.sendMail({
        from: process.env.APP_EMAIL,
      to: email,
      subject: `Your OTP, ${name}`,
      html: `
        <div style="padding: 1rem;">
          <h2>Hello, ${name}</h2>
          <p>Your password reset OTP is: <b>${otp}</b></p>
          <p>It will expire in 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,

 });
 console.log(`✅ OTP sent successfully to ${email}`);
 return info;
 }catch (error) {
console.error("❌ Error sending email:", err);
    
 }
};

module.exports = SendEmail