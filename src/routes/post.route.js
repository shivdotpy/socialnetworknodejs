const router = require("express").Router();

const {
  createPost,
  getLatestPosts,
  likePost,
  dislikePost,
  addComment,
  deletePost,
  deleteComment,
} = require("../controllers/post.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/create-post", authMiddleware, createPost);
router.get("/get-posts", authMiddleware, getLatestPosts);
router.get("/like/:id", authMiddleware, likePost);
router.get("/dislike/:id", authMiddleware, dislikePost);
router.post("/add-comment/:id", authMiddleware, addComment);
router.delete("/delete/:id", authMiddleware, deletePost);
router.delete("/delete-comment/:id/:commentId", authMiddleware, deleteComment);

module.exports = router;
