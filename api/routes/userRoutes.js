const express = require("express");
const router = express.Router();

const { registerUser, verifyEmail } = require("../controllers/userController");
const {loginUser} = require("../controllers/loginController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);

module.exports = router;
