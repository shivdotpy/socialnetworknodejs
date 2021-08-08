const router = require("express").Router();

const { createPost } = require("../controllers/post.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/create-post", authMiddleware, createPost);

module.exports = router;
