const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleById,
} = require("./controllers/topics.controllers");
const {
  handle500errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

// Error-handling Middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500errors);

// Generic errors
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

module.exports = app;
