const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/users");
const { sendVerificationEmail } = require("../utils/emailUtils");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user is already registered
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a verification token
    const verificationToken = crypto.randomBytes(16).toString("hex");
    const tokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Save verification token and expiration time in the database
    newUser.verificationToken = verificationToken;
    newUser.tokenExpiration = tokenExpiration;
    await newUser.save();

    // Send a verification email
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.json({ message: "User registered successfully. Please verify your email." });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Server Error" });
  }
};



const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by the verification token
    const user = await User.findOne({ verificationToken: token });

    // Check if the user exists and if the token has expired
    if (!user || user.tokenExpiration < Date.now()) {
      return res.status(400).json({ message: "Verification token is invalid or expired" });
    }

    // Token is valid, update user status to verified
    user.verified = true;
    user.verificationToken = null; // Clear the token after verification
    user.tokenExpiration = null; // Remove token expiration date
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error verifying email", error);
    res.status(500).json({ message: "Email Verification Error" });
  }
};

module.exports = { registerUser, verifyEmail };
