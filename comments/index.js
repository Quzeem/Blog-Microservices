const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  // The key of each comments array is the post ID
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = crypto.randomBytes(4).toString('hex');
  const { content } = req.body;

  // Get existing comments array associated with the post. If none(undefined), default to []
  const comments = commentsByPostId[req.params.id] || [];

  // add the new comment to comments array
  comments.push({ id: commentId, content });

  // re-assign the post comments associated with the new comments array
  commentsByPostId[req.params.id] = comments;

  // emit an event to the event bus/event broker
  await axios.post('http://localhost:4005/events', {
    type: 'commentCreated',
    data: { commentId, content, postId: req.params.id },
  });

  res.status(201).send(comments);
});

// listen for event from event bus
app.post('/events', (req, res) => {
  console.log('Event Recieved: ', req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log('Server running on port 4001');
});
