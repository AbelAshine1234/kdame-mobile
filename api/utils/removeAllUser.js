const mongoose = require("mongoose");
const User = require("./models/user");

async function deleteAllUsers() {
  try {
    await User.deleteMany({});
    console.log("All users deleted");
  } catch (error) {
    console.log("Error deleting users:", error);
  }
}

deleteAllUsers();
