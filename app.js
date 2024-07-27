const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:main");
const dbdebug = require("debug")("app:db");

const userRouter = require("./routs/users");
const homeRouter = require("./routs/home");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

console.log(app.get("env"));
if (app.get("env") == "development") {
  debug("morgan is active");
  app.use(morgan("tiny"));
}
///////////////////////////////////////////////////////////////////////////////////////
// conncting to db
mongoose
  .connect("mongodb://localhost:27017/expressApp")
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("could not connect to mongodb");
  });
///////////////////////////////////////////////////////////////////////////////////////

app.use("/api/users", userRouter);
app.use("/", homeRouter);
///////////////////////////////////////////////////////////////////////////////////////
// listening on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
