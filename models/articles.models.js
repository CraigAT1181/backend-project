const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE comments.article_id = $1
      GROUP BY articles.article_id
      `,
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist.",
        });
      } else {
        return article;
      }
    });
};

exports.fetchArticles = (query) => {
  const queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
`;

  if (query.hasOwnProperty("topic")) {
    const finalQueryStr =
      queryStr +
      `
      WHERE topic = $1 
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;
    `;

    return db.query(finalQueryStr, [query.topic]).then((result) => {
      const articles = result.rows;

      if (articles.length > 0) {
        return articles;
      } else {
        return Promise.reject({ status: 404, message: "Topic not found." });
      }
    });
  } else {
    const finalQueryStr =
      queryStr +
      `
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;`;

    return db.query(finalQueryStr).then((result) => {
      const articles = result.rows;
      return articles;
    });
  }
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
