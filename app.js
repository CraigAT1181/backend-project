const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

// Generic errors
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
