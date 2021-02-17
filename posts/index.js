const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = crypto.randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // emit an event to the event bus/event broker
  await axios.post('http://localhost:4005/events', {
    eventType: 'postCreated',
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

// listen for event from event bus
app.post('/events', (req, res) => {
  console.log('Event Recieved: ', req.body.eventType);

  res.send({});
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
