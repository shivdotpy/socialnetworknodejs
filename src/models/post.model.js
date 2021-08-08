const { Schema, model } = require("mongoose");

const postModel = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    text: {
      type: String,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("post", postModel);
