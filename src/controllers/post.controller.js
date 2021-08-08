const PostModel = require("../models/post.model");

const { POST_CREATED, ENTER_TEXT } = require("../utils/constants");

exports.createPost = (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: true, message: ENTER_TEXT });
  }

  const Post = new PostModel({
    user: req.userId,
    text,
  });
  Post.save();
  return res.status(200).send({ error: false, message: POST_CREATED });
};
