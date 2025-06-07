const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId },
    toUserId: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: "{VALUE} is not defined",
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
