exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.msg);
  }
};

exports.handle500errors = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};
