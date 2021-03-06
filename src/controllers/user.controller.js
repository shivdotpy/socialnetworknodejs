const { generatePin } = require("generate-pin");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const sendEmail = require("../utils/mailer");

// Models
const UserModel = require("../models/user.model");
const ActivateModel = require("../models/activate.model");
const NotificatiobModel = require("../models/nodtification.model");

// Constants
const {
  ENTER_NAME,
  ENTER_EMAIL,
  ENTER_PASSWORD,
  EMAIL_EXISTS,
  ACCOUNT_CREATED,
  ENTER_CODE,
  VALID_CODE,
  ACCOUNT_ACTIVATED,
  SOMETHING_WRONG,
  ACCOUNT_NOT_AVAILABLE,
  INVALID_PASSWORD,
  ACCOUNT_ALREADY_ACTIVATED,
  ACTIVATE_CODE_RESEND,
  ERROR_UPLOADING_IMAGE,
  SUCCESS_UPLOADING_IMAGE,
  PLEASE_ACTIVATE_ACCOUNT_BEFORE_LOGIN,
  ALREADY_FRIEND_REQUESTED,
} = require("../utils/constants");

exports.signup = async (req, res) => {
  // Validation
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).send({ error: true, message: ENTER_NAME });
  }

  if (!email) {
    return res.status(400).send({ error: true, message: ENTER_EMAIL });
  }

  if (!password) {
    return res.status(403).send({ error: true, message: ENTER_PASSWORD });
  }

  // Check if email already exist in db
  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(401).send({ error: true, message: EMAIL_EXISTS });
  } else {
    // continue saving
    const User = new UserModel({
      name,
      email,
      password,
    });
    User.save();

    const code = generatePin(1);
    sendEmail(email, "Activation Email", code[0]);

    // save to activate account (pin)
    const Activate = new ActivateModel({
      email,
      code: code[0],
    });
    Activate.save();

    return res.status(200).send({
      error: false,
      message: ACCOUNT_CREATED,
    });
  }
};

exports.activateAccount = async (req, res) => {
  const { email, code } = req.body;

  if (!email) {
    return res.status(400).send({ error: true, message: ENTER_EMAIL });
  }

  if (!code) {
    return res.status(400).send({ error: true, message: ENTER_CODE });
  }

  // check if code available in db
  const activateCodeObj = await ActivateModel.findOne({ email });
  if (!activateCodeObj) {
    return res
      .status(400)
      .send({ error: true, message: ACCOUNT_ALREADY_ACTIVATED });
  } else if (activateCodeObj.code !== code) {
    return res.status(400).send({ error: true, message: VALID_CODE });
  } else {
    // Remove document from db (activate) -- not be used in future
    ActivateModel.findOneAndDelete({ email }).exec();

    // change status of user in db
    const updated = await UserModel.findOneAndUpdate(
      { email },
      { activated: true }
    );
    if (updated) {
      return res.status(200).send({ error: false, message: ACCOUNT_ACTIVATED });
    } else {
      return res.staus(500).send({
        error: true,
        message: SOMETHING_WRONG,
      });
    }
  }
};

exports.resendActivationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ error: true, message: ENTER_EMAIL });
  }

  // Check if user already activated
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).send({
      error: true,
      message: ACCOUNT_NOT_AVAILABLE,
    });
  }

  if (user.activated) {
    return res.status(401).send({
      error: true,
      message: ACCOUNT_ALREADY_ACTIVATED,
    });
  }

  const activateCodeObj = await ActivateModel.findOne({ email });
  if (activateCodeObj) {
    // update code and send email
    const code = generatePin(1);
    sendEmail(email, "Resend: Activation Email", code[0]);

    // upcate code to activate account (pin)
    ActivateModel.findOneAndUpdate({ email }, { code: code[0] }).exec();

    return res
      .status(200)
      .send({ error: false, message: ACTIVATE_CODE_RESEND });
  } else {
    const code = generatePin(1);
    sendEmail(email, "Resend: Activation Email", code[0]);

    // save to activate account (pin)
    const Activate = new ActivateModel({
      email,
      code: code[0],
    });
    Activate.save();

    return res
      .status(200)
      .send({ error: false, message: ACTIVATE_CODE_RESEND });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).send({ error: true, message: ENTER_EMAIL });
  }

  if (!password) {
    return res.status(403).send({ error: true, message: ENTER_PASSWORD });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).send({
      error: true,
      message: ACCOUNT_NOT_AVAILABLE,
    });
  }

  if (!user.activated) {
    return res
      .status(401)
      .send({ error: false, message: PLEASE_ACTIVATE_ACCOUNT_BEFORE_LOGIN });
  }

  if (user.password !== password) {
    return res.status(401).send({ error: true, message: INVALID_PASSWORD });
  } else {
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).send({
      error: false,
      data: {
        token,
        name: user.name,
        email: user.email,
        _id: user._id,
        imgUrl: user.imgUrl,
      },
    });
  }
};

exports.uploadUserImage = (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send({
      error: true,
      message: ERROR_UPLOADING_IMAGE,
    });
  }

  const { S3_ACCESS_KEY, S3_SECRET_KEY } = process.env;

  const awsConfig = {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
    region: process.env.S3_REGION,
  };

  AWS.config.update(awsConfig);

  const S3 = new AWS.S3({ params: { Bucket: "socialnetworkuserimages" } });

  const buf = new Buffer(
    req.body.image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const data = {
    Key: req.userId,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  S3.putObject(data, async function (err, data) {
    if (err) {
      return res.status(500).send({
        error: false,
        message: ERROR_UPLOADING_IMAGE,
        data: err,
      });
    } else {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.userId,
        {
          imgUrl: `https://socialnetworkuserimages.s3.ap-south-1.amazonaws.com/${req.userId}`,
        },
        { new: true }
      );

      return res.status(200).send({
        error: false,
        message: SUCCESS_UPLOADING_IMAGE,
        data: { imgUrl: updatedUser.imgUrl },
      });
    }
  });
};

exports.addFriend = async (req, res) => {
  const { id } = req.params;

  const notificationAvailable = await NotificatiobModel.findOne({
    user: id,
    requestedUser: req.userId,
  });

  if (notificationAvailable) {
    return res
      .status(400)
      .send({ error: true, message: ALREADY_FRIEND_REQUESTED });
  }

  const Notification = new NotificatiobModel({
    user: id,
    message: `${req.name} wants to be your friend`,
    requestedUser: req.userId,
  });

  const savedNotificaion = await Notification.save();

  return res
    .status(201)
    .send({ error: false, message: "Friend request sent successfully" });
};

exports.acceptFriendRequest = async (req, res) => {
  const { id } = req.params;

  const notification = await NotificatiobModel.findById(id);

  await UserModel.findByIdAndUpdate(
    req.userId,
    {
      $push: { friends: notification.requestedUser },
    },
    { new: true }
  );

  await UserModel.findByIdAndUpdate(
    notification.requestedUser,
    {
      $push: { friends: req.userId },
    },
    { new: true }
  );

  await notification.remove();
  return res
    .status(200)
    .send({ error: false, message: "Friend request accepted" });
};

exports.getFriends = async (req, res) => {
  const user = await UserModel.findById(req.userId).populate(
    "friends",
    "name imgUrl"
  );
  return res.status(200).send({ error: false, data: user.friends });
};
