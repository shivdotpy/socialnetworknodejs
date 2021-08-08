const jwt = require("jsonwebtoken");

const { NO_ACCESS_TOKEN, SESSION_EXPIRED } = require("../utils/constants");

exports.authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  // If not exist
  if (!authorization) {
    return res.status(401).send({ error: true, message: NO_ACCESS_TOKEN });
  }
  try {
    jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
  } catch (e) {
    console.log("Authorization Middleware Error: ", e);
    return res.status(401).send({ error: true, message: SESSION_EXPIRED });
  }

  next();
};
