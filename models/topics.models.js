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
