\c nc_news_test;

SELECT
articles.author, articles.article_id, articles.topic, articles.created_at,
articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;




-- author, title, article_id, topic, 
-- created_at, votes, article_img_url 
-- FROM articles
-- WHERE 