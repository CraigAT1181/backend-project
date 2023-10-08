const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
  checkTopic,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const query = req.query;
  const topic = req.query.topic;

  if (topic !== undefined) {
    checkTopic(topic)
      .then(() => {})
      .catch((err) => {
        next(err);
      });
  }

  fetchArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
