const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

// Generic errors
app.use((err, req, res, next) => {
  if (err) {
    res.status(404).send({ msg: "Path not found." });
  }
});

module.exports = app;
