const router = require("express").Router();

const {
  signup,
  activateAccount,
  signin,
  resendActivationCode,
  uploadUserImage,
  addFriend,
  acceptFriendRequest,
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

router.post("/add-friend/:id", authMiddleware, addFriend);
router.put("/accept-friend/:id", authMiddleware, acceptFriendRequest);

module.exports = router;
