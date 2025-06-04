const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const app = express();

app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          res.send("Login succesfull");
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("Email id is not found");
      }
    } else {
      throw new Error("Email id is not valid");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;
    const ALLOWED = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User Updated Succesfully");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    res.send("User Deleted Succesfully");
  } catch (err) {
    res.status(404).send("User Not Found");
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send("User Not Found");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("User Not Found");
  }
});

app.post("/signup", async (req, res) => {
  //console.log(req.body);
  try {
    //Validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Encryption
    const passwordHash = await bcrypt.hash(password, 10);

    //Instance of model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User sign up succesfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
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
