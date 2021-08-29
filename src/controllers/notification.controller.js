const NotificatiobModel = require("../models/nodtification.model");

exports.getAll = async (req, res) => {
  const notifications = await NotificatiobModel.find({ user: req.userId });
  return res.status(200).send({ error: false, data: notifications });
};
