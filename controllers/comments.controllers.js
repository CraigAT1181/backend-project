const {
  fetchCommentsByArticleId,
  insertComment,
  removeComment,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
