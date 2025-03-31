const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationToken) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abelashinework@gmail.com",
      pass: "tqkm lnkw vgsu bfjp", // Consider using environment variables for credentials
    },
  });

  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Verification Email",
    text: `Click on the following link to verify your email: http://localhost:8000/api/users/verify/${verificationToken}`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Error sending email: " + error);
  }
};

module.exports = { sendVerificationEmail };
