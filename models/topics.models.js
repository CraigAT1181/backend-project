const db = require("../db/connection.js");
const { readFile } = require("fs/promises");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};
