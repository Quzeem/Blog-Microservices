// This service creates a structure for posts and their respective comments
// TIt also handles retrieval of posts and their associated comments. It doesn't emit any event
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

// posts storage
const posts = {};
// Example
// const posts = {
//   dh589j: {
//     id: 'dh589j',
//     title: 'Minnie winnie',
//     comments: [{ id: 'h57rhf', content: 'nice post' }, { id: 'rh576hg', content: 'cool' }],
//   },
// };

// helper function for handling events
const handleEvents = (eventType, data) => {
  // For postCreated Type
  if (eventType === 'postCreated') {
    const { id, title } = data;
    // create post
    posts[id] = { id, title, comments: [] };
  }

  // For commentCreated Type
  if (eventType === 'commentCreated') {
    const { id, content, postId, status } = data;
    // retrieve the specific post
    const post = posts[postId];
    // add newly created comment to its comments array
    post.comments.push({ id, content, status });
  }

  // For commentUpdated Type
  if (eventType === 'commentUpdated') {
    const { id, content, postId, status } = data;
    // retrieve the post using the postId
    const post = posts[postId];
    // find the specific comment using the comment id
    const comment = post.comments.find((comment) => comment.id === id);
    // update the comment generically
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

// listen for event from event bus
app.post('/events', (req, res) => {
  // event
  const { eventType, data } = req.body;

  handleEvents(eventType, data);

  console.log(posts);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Server running on port 4002');

  // handle missing events for query service when it was down
  // Get all events from the event bus data store
  const { data } = await axios.get(
    'http://event-bus-clusterip-srv:4005/events'
  );

  for (let event of data) {
    console.log('Processing event: ', event.eventType);
    handleEvents(event.eventType, event.data);
  }
});
