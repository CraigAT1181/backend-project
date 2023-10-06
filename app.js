const express = require("express");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handle500errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const { getEndpoints } = require("./controllers/api.controllers");
const {
  getCommentsByArticleId,
  addCommentByArticleId,
  deleteComment,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteComment);

// Error-handling Middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500errors);

// Generic errors
app.all("/*", (req, res) => {
  res.status(404).send({ message: "Please check your path is correct." });
});

module.exports = app;
