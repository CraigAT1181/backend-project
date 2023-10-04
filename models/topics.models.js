const db = require("../db/connection.js");
const { readFile } = require("fs/promises");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.fetchAllEndpoints = () => {
  return readFile("./endpoints.json", "utf-8").then((file) => {
    const parsedApi = JSON.parse(file);

    return parsedApi;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles 
    WHERE article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article does not exist." });
      } else {
        return article;
      }
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT
articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;
    `
    )
    .then((result) => {
      const articles = result.rows;
      return articles;
    });
};
