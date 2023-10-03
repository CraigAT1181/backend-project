const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const index = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(index));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET: 200 sends an array of topic objects to the client.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("Generic handler", () => {
  test("GET: 404 sends an appropriate status and error message.", () => {
    return request(app)
      .get("/api/top")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found.");
      });
  });
});

describe("/api", () => {
  test("GET: 200 sends an object with all available endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("Should check that all available APIs are included.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 sends an article matching the article_id.", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(2);
      });
  });
  test("Article should be of the correct format.", () => {
    return request(app)
      .get("/api/articles/2")
      .then(({ body }) => {
        const article = body.article;
        console.log(article);
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });

  test("GET 404 Article Not Found", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("Article does not exist.");
      });
  });
});
