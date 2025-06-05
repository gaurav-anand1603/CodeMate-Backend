const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const updateData = req.body;
    const user = req.user;
    const userId = user._id;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("Profile updated successfully");
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  // Validating existing password
  try {
    const existingPassword = req.body.existingPassword;
    const isValidPassword = await bcrypt.compare(
      existingPassword,
      req.user.password
    );
    console.log("existingPassword", existingPassword);
    console.log("isValidPassword", isValidPassword);
    if (!isValidPassword) {
      throw new Error("existing password is incorrect");
    }

    const newPassword = req.body.newPassword;
    console.log("newPassword", newPassword);
    const passwordHash = await bcrypt.hash(newPassword, 10);
    console.log("passwordHash", passwordHash);
    req.user.password = passwordHash;
    await req.user.save();
    res.send("New Password Updated");
    // Updating new password
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

module.exports = profileRouter;
