const {
  signup,
  activateAccount,
  signin,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/activate", activateAccount);
router.post("/signin", signin);

module.exports = router;
