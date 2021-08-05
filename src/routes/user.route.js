const { signup, activateAccount } = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);

router.post("/activate", activateAccount);

module.exports = router;
