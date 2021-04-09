const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const commentsByPostId = {};
// Example
// const commentsByPostId = {
//   'postId': [{id, content, status}, {id, content, status}],
//   'postId': [{id, content, status}, {id, content, status}]
// }

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
  comments.push({ id: commentId, content, status: 'pending' });

  // re-assign the post comments associated with the new comments array
  commentsByPostId[req.params.id] = comments;

  // emit an event to the event bus/event broker
  await axios.post('http://event-bus-clusterip-srv:4005/events', {
    eventType: 'commentCreated',
    data: { id: commentId, content, postId: req.params.id, status: 'pending' },
  });

  res.status(201).send(comments);
});

// listen for event from event bus
app.post('/events', async (req, res) => {
  console.log('Event Recieved: ', req.body.eventType);

  const { eventType, data } = req.body;

  // handle comment moderation event
  if (eventType === 'commentModerated') {
    const { id, content, postId, status } = data;
    // retrieve the comments of the specific post using the postId
    const comments = commentsByPostId[postId];
    // find the specific comment using the comment id
    const comment = comments.find((comment) => comment.id === id);
    // change the comment status to the status recieved in the data
    comment.status = status;
    // emit an event to the event bus
    await axios.post('http://event-bus-clusterip-srv:4005/events', {
      eventType: 'commentUpdated',
      data: { id, content, postId, status },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Server running on port 4001');
});
