const router = require("express").Router();

const {
  signup,
  activateAccount,
  signin,
  resendActivationCode,
} = require("../controllers/user.controller");

router.post("/signup", signup);
router.post("/activate", activateAccount);
router.post("/resend-activate-code", resendActivationCode);
router.post("/signin", signin);

module.exports = router;
