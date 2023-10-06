const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const index = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(index));
afterAll(() => db.end());

describe("/api", () => {
  test("GET: 200 sends an object with all available endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  test("Should check that all available APIs are included.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 sends an array of topic objects to the client.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 sends all articles in the correct format.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("Should return articles without a body, and with a commment_count.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("Should return articles with correct comment_count.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles[0].comment_count).toBe(2);
      });
  });
  test("Should return sorted articles in desc order by date.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });

  test("GET: 200 sends an article relevant to a query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        expect(body.articles[0].topic).toBe("cats");
      });
  });

  test("GET: 404 returns a status and error if query finds no results.", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("Topic not found.");
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("GET: 200 sends an article matching the article_id.", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(3);
        });
    });
    test("Article should be of the correct format.", () => {
      return request(app)
        .get("/api/articles/3")
        .then(({ body }) => {
          const article = body.article;
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
    });

    test("GET: 200 Should return an article, by article_id, displaying a comment_count.", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
    });

    test("GET 404 Article Not Found", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then((response) => {
          expect(response.text).toBe("Article does not exist.");
        });
    });

    test("GET 400 Bad Request", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request.");
        });
    });
  });

  describe("PATCH", () => {
    test("200: Should update an article by article_id.", () => {
      const articleUpdate = { inc_votes: -100 };
      const newArticle = {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: -100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };

      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject(newArticle);
        });
    });

    test("POST:400 Error: Invalid date-type input.", () => {
      const invalidPost = { inc_votes: "text" };

      return request(app)
        .post("/api/articles/3/comments")
        .send(invalidPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Incorrect data input.");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 sends array of all comments by article_id.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
        });
      });
  });

  test("Should return comments in correct format.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  test("Should return sorted comments in desc order by date.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(comments).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });

  test("POST: 201 adds a new comment by article_id, and returns the comment.", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Interesting text",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;

        expect(typeof comment).toBe("object");
        expect(comment.body).toEqual("Interesting text");
        expect(comment.author).toEqual("butter_bridge");
        expect(comment.article_id).toBe(3);
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
      });
  });

  test("POST:404 Error: Provided with an unknown user.", () => {
    const newComment = {
      username: "unknown_user",
      body: "Interesting text",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Username doesn't exist.");
      });
  });

  test("POST:400 Error: Missing essential comment property.", () => {
    const newComment = {
      body: "Interesting text",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Incorrect data input.");
      });
  });

  test("GET 404 Article Not Found", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("Article does not exist.");
      });
  });

  test("GET 400 Bad Request", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request.");
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

describe("/api/comments/:comment_id", () => {
  test("DELETE: 200 sends an article matching the article_id.", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("DELETE:404 Error and message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("Comment doesn't exist.");
      });
  });
  test("DELETE:400 Error and message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request.");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 Should return an array of all users.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const usersArray = body.users;
        expect(usersArray.length).toBe(4);
        usersArray.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
