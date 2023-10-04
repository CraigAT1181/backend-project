const db = require("../db/connection.js");
const { readFile } = require("fs/promises");

exports.fetchAllEndpoints = () => {
  return readFile("./endpoints.json", "utf-8").then((file) => {
    const parsedApi = JSON.parse(file);

    return parsedApi;
  });
};
