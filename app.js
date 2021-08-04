const express = require("express");
const chalk = require("chalk");
const cors = require("cors");

const { PORT } = require("./src/utils/settings");
const {
  WELCOME_MESSAGE,
  USER_ROUTE,
  INITIAL_PAGE_MESSAGE,
} = require("./src/utils/constants");

// Routes
const UserRoutes = require("./src/routes/user.route");

const app = express();

app.use(cors());

app.get("/", () =>
  res.status(200).send({ error: false, message: INITIAL_PAGE_MESSAGE })
);

app.use(USER_ROUTE, UserRoutes);

app.listen(PORT, () => {
  console.log(chalk.white.bgBlack.bold(WELCOME_MESSAGE));
});
