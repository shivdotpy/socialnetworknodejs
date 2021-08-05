const { Schema, model } = require("mongoose");

const activateModel = Schema(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("activate", activateModel);
