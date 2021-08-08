const PostModel = require("../models/post.model");

const {
  POST_CREATED,
  ENTER_TEXT,
  POST_LIKED,
  POST_DISLIKED,
} = require("../utils/constants");

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

exports.getLatestPosts = async (req, res) => {
  const posts = await PostModel.find()
    .limit(10)
    .sort({ updatedAt: "desc" })
    .populate("user", "name");
  // .populate("likes", "name"); // Can use in future if likes user is needed in posts
  return res.status(200).send({ error: false, data: posts });
};

exports.likePost = async (req, res) => {
  const { id } = req.params;

  PostModel.findByIdAndUpdate(id, {
    $push: { likes: req.userId },
  }).exec();

  return res.status(200).send({ error: false, message: POST_LIKED });
};

exports.dislikePost = (req, res) => {
  const { id } = req.params;

  PostModel.findByIdAndUpdate(id, {
    $pull: { likes: req.userId },
  }).exec();

  return res.status(200).send({ error: false, message: POST_DISLIKED });
};
