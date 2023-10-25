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

      if (comments.length > 0) {
        return comments;
      } 
      else {
/* Add in here, some logic that tests whether the array is 0 because the article
doesn't exist, or because the article simply has no comments.*/

        return Promise.reject({
          status: 404,
          message: "Article does not exist.",
        });
      }
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *;
    `,
      [article_id, username, body]
    )
    .then((result) => {
      const comment = result.rows[0];
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Username doesn't exist.",
        });
      } else {
        return comment;
      }
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1;
  `,
      [comment_id]
    )

    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Couldn't find a comment with that ID.",
        });
      }
    });
};
