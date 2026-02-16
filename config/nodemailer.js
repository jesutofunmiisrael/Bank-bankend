const nodemailer = require("nodemailer")
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port:2525,
  auth:{
   user:process.env.MAILTRAP_USER,
   pass:process.env.MAILTRAP_PASS,
  },
});
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mailtrap connection failed:", err);
  } else {
    console.log("✅ Mailtrap is ready to send emails");
  }
});

module.exports = transporter