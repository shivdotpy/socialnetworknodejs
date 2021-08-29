const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();

const { PORT } = require("./src/utils/settings");

var express = require("express");
var app = express();
const server = app.listen(PORT);
const io = new Server(server, { cors: { origin: "*" } });

const {
  USER_ROUTE,
  INITIAL_PAGE_MESSAGE,
  POST_ROUTE,
  NOTIFICATION_ROUTE,
} = require("./src/utils/constants");

// Routes
const UserRoutes = require("./src/routes/user.route");
const PostRoutes = require("./src/routes/post.route");
const NotificationRoutes = require("./src/routes/notification.route");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) =>
  res.status(200).send({ error: false, message: INITIAL_PAGE_MESSAGE })
);

app.use(USER_ROUTE, UserRoutes);
app.use(POST_ROUTE, PostRoutes);
app.use(NOTIFICATION_ROUTE, NotificationRoutes);

app.use("/public", express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log("Socket Client connected...", socket.id);

  // set socket to global variable
  global.io = io;
});
