const nodemailer = require("nodemailer");
require('dotenv').config()

module.exports = async (user, subject, text) => {
  try {

    const html =`
      <div style="text-align: center; font-size: 18px">
        <p>Hey ${user.name}\nThank you for signing up with your email ${user.email}. </p>
        <p>Team MathonGo.</p>
        <a href="http://localhost:5000/apli/unsubscribes/${user._id}">Click here to unsubscribed</a>
      </div>
    `
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.example.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.SECRETE_KEY,
      },
      from: process.env.FROM_EMAIL,

    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: subject,
      text: text,
      html : html
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
