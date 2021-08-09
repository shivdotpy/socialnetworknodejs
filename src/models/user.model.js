const { Schema, model } = require("mongoose");

const userModel = Schema(
  {
    name: {
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
  },
  { timestamps: true }
);

module.exports = model("user", userModel);
