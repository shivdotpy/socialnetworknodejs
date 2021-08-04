const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const { PORT } = require("./src/utils/settings");
const {
  WELCOME_MESSAGE,
  USER_ROUTE,
  INITIAL_PAGE_MESSAGE,
} = require("./src/utils/constants");

// Routes
const UserRoutes = require("./src/routes/user.route");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) =>
  res.status(200).send({ error: false, message: INITIAL_PAGE_MESSAGE })
);

app.use(USER_ROUTE, UserRoutes);

app.listen(PORT, () => {
  console.log(chalk.white.bgBlack.bold(WELCOME_MESSAGE));
});
