const router = require("express").Router();

const {
  createPost,
  getLatestPosts,
  likePost,
  dislikePost,
} = require("../controllers/post.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/create-post", authMiddleware, createPost);
router.get("/get-posts", authMiddleware, getLatestPosts);
router.get("/like/:id", authMiddleware, likePost);
router.get("/dislike/:id", authMiddleware, dislikePost);

module.exports = router;
