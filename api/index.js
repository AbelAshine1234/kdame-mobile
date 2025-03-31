const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb://abelashinework:6p60nktompjSP2MM@ac-mxzm0bk-shard-00-00.1f6e9ju.mongodb.net:27017,ac-mxzm0bk-shard-00-01.1f6e9ju.mongodb.net:27017,ac-mxzm0bk-shard-00-02.1f6e9ju.mongodb.net:27017/?ssl=true&replicaSet=atlas-b2je8t-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Error connecting to mongodb: " + error);
  });

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("server listening on port " + port);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
