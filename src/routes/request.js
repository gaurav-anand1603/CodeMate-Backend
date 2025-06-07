const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      // Connection to establish
      if (!["interested", "ignored"].includes(status)) {
        throw new Error("Not a Valid Status");
      }
      // checking self req
      if (toUserId == fromUserId) {
        throw new Error("Can't send connection req to yourself");
      }
      //checking to user id is valid or not
      const user = await User.findById(toUserId);
      if (!user) {
        throw new Error("User id is not valid");
      }
      // checking existing conn req?
      const existingConnectionRequest = await ConnectionRequest.findOne({
        fromUserId: fromUserId,
        toUserId: toUserId,
      });
      const existingConnectionRequestReverse = await ConnectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
      });
      if (existingConnectionRequest || existingConnectionRequestReverse) {
        throw new Error("Existing Req already exists");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Connection Req Sent",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR " + err.message);
    }
  }
);

module.exports = requestRouter;
