if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const server = express();
const articleRouter = require("./routes/articleRoutes");
const indexRouter = require("./routes/indexRoutes");
const path = require("path");
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");

const rootDir = path.dirname(process.mainModule.filename);
const methodOverride = require("method-override");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

server.use(express.urlencoded({ extended: false }));
server.use(methodOverride("_method"));

server.set("view engine", "ejs");
server.set("views", path.join(rootDir, "views"));
server.set("layout", "layouts/layout");

server.use(express.static(path.join(rootDir, "public")));
server.use(expressLayout);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

server.use("/", indexRouter);
server.use("/articles", articleRouter);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server started at port ${port}`));
