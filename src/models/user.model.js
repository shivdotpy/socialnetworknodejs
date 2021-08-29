const { Schema, model } = require("mongoose");

const userModel = Schema(
  {
    name: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("user", userModel);
