const router = require("express").Router();

const {
  createPost,
  getLatestPosts,
} = require("../controllers/post.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/create-post", authMiddleware, createPost);

router.get("/get-posts", getLatestPosts);

module.exports = router;
