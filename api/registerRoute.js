// Register Route
app.post("/register", async (req, res) => {
    try {
      const { error } = registrationSchema.validate(req.body);
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: errorMessages });
      }
  
      const { name, email, password } = req.body;
  
      // Check if the user is already registered
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      const verificationToken = crypto.randomBytes(16).toString("hex");
  
      newUser.verifcationToken = verificationToken;
      await newUser.save();
  
      // Send verification email
      await sendVerficationEmail(newUser.email, newUser.verificationToken);
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log("Error registering:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  