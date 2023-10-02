const { fetchAllTopics } = require("../models/topics.models");

exports.getAllTopics = (req, res, next) => {
  console.log(req, "Controller!");
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err, "In the controller!");
      next(err);
    });
};
