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
        ref: "post",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("post", postModel);
