const {
  fetchAllTopics,
  fetchAllEndpoints,
} = require("../models/topics.models");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints })
    })
    .catch((err) => {
      next(err);
    });
};
