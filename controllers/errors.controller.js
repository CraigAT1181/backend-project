exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Please check your query and try again." });
  }

  if (err.code === "23503") {
    res.status(404).send({ message: "Username doesn't exist." });
  }

  if (err.code === "23502") {
    res.status(400).send({ message: "Incorrect data input." });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
};

exports.handle500errors = (err, req, res, next) => {
  
  res.status(500).send({ message: "Internal Server Error" });
};
