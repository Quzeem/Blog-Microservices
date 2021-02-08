const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  // The key of each comments array is the post ID
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = crypto.randomBytes(4).toString('hex');
  const { content } = req.body;

  // Get existing comments array associated with the post. If none(undefined), default to []
  const comments = commentsByPostId[req.params.id] || [];

  // add the new comment to comments array
  comments.push({ id: commentId, content });

  // re-assign the post comments associated with the new comments array
  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Server running on port 4001');
});
