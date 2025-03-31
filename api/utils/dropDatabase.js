const mongoose = require('mongoose');

// MongoDB connection string
const dbURI = "mongodb://abelashinework:6p60nktompjSP2MM@ac-mxzm0bk-shard-00-00.1f6e9ju.mongodb.net:27017,ac-mxzm0bk-shard-00-01.1f6e9ju.mongodb.net:27017,ac-mxzm0bk-shard-00-02.1f6e9ju.mongodb.net:27017/?ssl=true&replicaSet=atlas-b2je8t-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Function to drop the database
async function dropDatabase() {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();
    console.log("Database dropped");
    mongoose.connection.close();
  } catch (error) {
    console.log("Error dropping database:", error);
    mongoose.connection.close();
  }
}

// Run the function
dropDatabase();
