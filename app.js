const express = require("express");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handle500errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const { getAllEndpoints } = require("./controllers/api.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

// Error-handling Middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500errors);

// Generic errors
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

module.exports = app;
