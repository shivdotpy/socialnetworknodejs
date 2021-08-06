const {
  signup,
  activateAccount,
  signin,
  resendActivationCode,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);

router.post("/activate", activateAccount);

router.post("/resend-activate-code", resendActivationCode);

router.post("/signin", signin);

module.exports = router;
