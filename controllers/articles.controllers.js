const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const queryKey = Object.keys(req.query);
  const queryValue = Object.values(req.query);

  fetchArticles(queryKey, queryValue)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err, "controller")
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
