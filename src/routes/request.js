const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  // Connection Login
  res.send(user.firstName + " is sending connection request");
});

module.exports = requestRouter;
