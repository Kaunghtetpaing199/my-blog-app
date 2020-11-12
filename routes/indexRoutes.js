const express = require("express");
const router = express.Router();
const Blog = require("../models/article");

router.get("/", async (req, res) => {
  const articles = await Blog.find();
  res.render("index", { articles: articles });
});

module.exports = router;
