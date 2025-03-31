const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Import crypto module
const User = require("../models/users");

// Generate a fixed secret key (Not recommended for production, use an environment variable instead)
const secretKey = crypto.randomBytes(32).toString("hex");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ token: token });
  } catch (error) {
    console.log("Error login", error);
    res.status(500).json({ message: "Login Failed" });
  }
};

module.exports = { loginUser };
