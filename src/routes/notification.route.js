const router = require("express").Router();

const { authMiddleware } = require("../middleware/auth.middleware");

const { getAll } = require("../controllers/notification.controller");

router.get("/all", authMiddleware, getAll);

module.exports = router;
