const { Schema, model } = require("mongoose");

const notificationModel = Schema(
  {
    type: {
      type: String,
    },
    message: {
      type: String,
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    requestedUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = model("notification", notificationModel);
