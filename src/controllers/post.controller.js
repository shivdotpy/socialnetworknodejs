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
      await PostModel.populate(createdPost, {
        path: "user",
        select: "name imgUrl",
      })
    );
  }

  return res.status(200).send({ error: false, message: POST_CREATED });
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const deletedItem = await PostModel.findByIdAndDelete(id);
  if (!deletedItem) {
    return res
      .status(400)
      .send({ error: false, message: "Please check post id" });
  }

  // Socket
  if (global.io && global.io.sockets && global.io.sockets.emit) {
    global.io.sockets.emit("delete-post", { _id: deletedItem._id });
  }

  return res
    .status(200)
    .send({ error: false, message: "Post deleted successfully" });
};

exports.getLatestPosts = async (req, res) => {
  const posts = await PostModel.find()
    .limit(10)
    .sort({ createdAt: "desc" })
    .populate("user", "name imgUrl")
    .populate("comments.user", "name imgUrl");

  const postsClone = [...posts];
  postsClone.forEach((post) => {
    post.comments.sort((c1, c2) => c2.updatedAt - c1.updatedAt);
  });
  return res.status(200).send({ error: false, data: postsClone });
};

exports.loadMorePosts = async (req, res) => {
  const posts = await PostModel.find()
    .sort({ createdAt: "desc" })
    .skip(10)
    .limit(40)
    .populate("user", "name imgUrl")
    .populate("comments.user", "name imgUrl");

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

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    {
      $push: { comments: { text, user: req.userId } },
    },
    { new: true }
  ).exec();

  if (!updatedPost) {
    return res.status(400).send({ error: true, message: "Post id is invalid" });
  }

  const { _id, comments } = await PostModel.populate(updatedPost, {
    path: "comments.user",
    select: "name imgUrl",
  });

  // Socket
  if (global.io && global.io.sockets && global.io.sockets.emit) {
    global.io.sockets.emit("comments", {
      _id,
      comments,
    });
  }

  return res.status(200).send({ error: true, message: COMMENT_SAVED });
};

exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    {
      $pull: { comments: { _id: commentId } },
    },
    { new: true }
  );

  const { _id, comments } = await PostModel.populate(updatedPost, {
    path: "comments.user",
    select: "name imgUrl",
  });

  // Socket
  if (global.io && global.io.sockets && global.io.sockets.emit) {
    global.io.sockets.emit("comments", {
      _id,
      comments,
    });
  }

  return res
    .status(200)
    .send({ error: false, message: "Comment deleted successfully" });
};
