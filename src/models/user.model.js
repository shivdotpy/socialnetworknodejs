const { Schema, model } = require("mongoose");

const userModel = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = model("user", userModel);
