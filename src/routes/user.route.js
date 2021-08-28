const router = require("express").Router();

const {
  signup,
  activateAccount,
  signin,
  resendActivationCode,
  uploadUserImage,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const { imageStorage } = require("../utils/helpers");

router.post("/signup", signup);
router.post("/activate", activateAccount);
router.post("/resend-activate-code", resendActivationCode);
router.post("/signin", signin);

router.post(
  "/upload-profile-image",
  authMiddleware,
  imageStorage.single("userimage"),
  uploadUserImage
);

module.exports = router;
