const db = require("../db/connection.js");

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
        return Promise.reject({
          status: 404,
          message: "Article does not exist.",
        });
      } else {
        return article;
      }
    });
};

exports.fetchArticles = (queryKey, queryValue) => {
  if (queryKey && queryValue) {
    console.log(queryKey, queryValue, "PASSED  IN");
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
WHERE $1 = $2 
GROUP BY articles.article_id 
ORDER BY articles.created_at DESC
;`,
        [queryKey, queryValue]
      )
      .then((result) => {
        const articles = result.rows;
        console.log(articles, "Model Query");
        return articles;
      });
  } else if (!(queryKey && queryValue)) {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
    articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC
    ;`
      )
      .then((result) => {
        const articles = result.rows;
        console.log(articles, "Model NO query");
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
