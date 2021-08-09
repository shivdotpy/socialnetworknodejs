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
        type: new Schema(
          {
            text: { type: String },
            user: {
              type: Schema.Types.ObjectId,
              ref: "user",
            },
          },
          { timestamps: true }
        ),
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
