const { validateSignUpData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });
      if (user) {
        const isValidPassword = await user.validatePassword(password);
        if (isValidPassword) {
          // Cookie(JWT Auth)

          const jwtToken = await user.getJWT();

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

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  try {
    // Cookie Expire
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = authRouter;
