const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )

    .then((result) => {
      const comments = result.rows;

      if (comments[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article does not exist." });
      } else {
        return comments;
      }
    });
};
