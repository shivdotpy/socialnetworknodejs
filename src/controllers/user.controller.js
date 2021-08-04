const UserModel = require("../models/user.model");

exports.signup = async (req, res) => {
  // Validation
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(403).send({ error: true, message: "Please enter name" });
  }

  if (!email) {
    return res.status(403).send({ error: true, message: "Please enter email" });
  }

  if (!password) {
    return res
      .status(403)
      .send({ error: true, message: "Please enter password" });
  }

  // Check if email already exist in db
  const user = await UserModel.findOne({ email });
  if (user) {
    return res
      .status(401)
      .send({ error: true, message: "Email already exists" });
  } else {
    // continue saving
    const User = new UserModel({
      name,
      email,
      password,
    });
    User.save();
    return res
      .status(200)
      .send({
        error: false,
        message: "Account created successfully, please check email for OTP",
      });
  }
};
