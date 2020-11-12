const express = require("express");
const router = express.Router();
const Blog = require("../models/article");

router.get("/new", (req, res) => {
  res.render("new", { article: new Blog() });
});

router.get("/:slug", async (req, res) => {
  const article = await Blog.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("show", { article: article });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Blog.findById(req.params.id);
  res.render("edit", { article: article });
});

router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Blog.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Blog();
    next();
  },
  saveArticleAndRedirect("new")
);

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let blog = req.article;
    blog.title = req.body.title;
    blog.description = req.body.description;
    try {
      blog = await blog.save();
      res.redirect(`/articles/${blog.slug}`);
    } catch (e) {
      res.render(path, { article: blog });
    }
  };
}

module.exports = router;
