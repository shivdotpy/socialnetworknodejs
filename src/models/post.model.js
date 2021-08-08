const { Schema, model } = require("mongoose");

const postModel = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("post", postModel);
