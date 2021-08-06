const { generatePin } = require("generate-pin");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/mailer");

// Models
const UserModel = require("../models/user.model");
const ActivateModel = require("../models/activate.model");

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
    return res.status(400).send({ error: true, message: VALID_CODE });
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

  if (user.password !== password) {
    return res.status(401).send({ error: true, message: INVALID_PASSWORD });
  } else {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({
      error: false,
      data: { token, name: user.name, email: user.email },
    });
  }
};
