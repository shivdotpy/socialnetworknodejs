const PostModel = require("../models/post.model");

const {
  POST_CREATED,
  ENTER_TEXT,
  POST_LIKED,
  POST_DISLIKED,
  COMMENT_SAVED,
} = require("../utils/constants");

exports.createPost = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: true, message: ENTER_TEXT });
  }

  const Post = new PostModel({
    user: req.userId,
    text,
  });
  const createdPost = await Post.save();
  if (global.io && global.io.sockets && global.io.sockets.emit) {
    global.io.sockets.emit(
      "new-post",
      await PostModel.populate(createdPost, { path: "user", select: "name" })
    );
  }

  return res.status(200).send({ error: false, message: POST_CREATED });
};

exports.getLatestPosts = async (req, res) => {
  const posts = await PostModel.find()
    .limit(10)
    .sort({ createdAt: "desc" })
    .populate("user", "name")
    .populate("comments.user", "name");

  const postsClone = [...posts];
  postsClone.forEach((post) => {
    post.comments.sort((c1, c2) => c2.updatedAt - c1.updatedAt);
  });
  return res.status(200).send({ error: false, data: postsClone });
};

exports.likePost = async (req, res) => {
  const { id } = req.params;

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    {
      $push: { likes: req.userId },
    },
    { new: true }
  );

  if (global.io && global.io.sockets && global.io.sockets.emit) {
    global.io.sockets.emit("new-like", {
      _id: updatedPost._id,
      likes: updatedPost.likes,
    });
  }
  return res.status(200).send({ error: false, message: POST_LIKED });
};

exports.dislikePost = async (req, res) => {
  const { id } = req.params;

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    {
      $pull: { likes: req.userId },
    },
    { new: true }
  );

  if (global.io && global.io.sockets && global.io.sockets.emit) {
    global.io.sockets.emit("new-like", {
      _id: updatedPost._id,
      likes: updatedPost.likes,
    });
  }

  return res.status(200).send({ error: false, message: POST_DISLIKED });
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  if (!text) {
    return res.status(400).send({ error: true, message: ENTER_TEXT });
  }

  PostModel.findByIdAndUpdate(id, {
    $push: { comments: { text, user: req.userId } },
  }).exec();

  return res.status(200).send({ error: true, message: COMMENT_SAVED });
};
