exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request." });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.msg);
  }
};

exports.handle500errors = (err, req, res, next) => {
  console.log({ error: err });
  res.status(500).send({ message: "Internal Server Error" });
};
