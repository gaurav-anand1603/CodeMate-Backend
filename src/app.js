const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  //console.log(req.body);

  //Instance of model
  const user = new User(req.body);

  await user.save();
  res.send("User sign up succesfully");
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.error("Error");
  });
