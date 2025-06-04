const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          // Cookie(JWT Auth)

          const jwtToken = await jwt.sign({ _id: user.id }, "Gaurav@1234");

          res.cookie("token", jwtToken);
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

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  // Connection Login
  res.send(user.firstName + " is sending connection request");
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
