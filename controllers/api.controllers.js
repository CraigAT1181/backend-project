const { fetchAllEndpoints } = require("../models/api.models");

exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
