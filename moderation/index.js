// The service is responsible for moderating comments from default pending state -> approved || rejected
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// listen for events from event broker
app.post('/events', async (req, res) => {
  const { eventType, data } = req.body;

  if (eventType === 'commentCreated') {
    const { id, content, postId } = data;
    // moderate the comment by checking if it contains an unwanted word. say 'fool'
    const status = content.includes('fool') ? 'rejected' : 'approved';
    // emit an event to the event bus
    await axios.post('http://event-bus-clusterip-srv:4005/events', {
      eventType: 'commentModerated',
      data: { id, content, postId, status },
    });
  }
  res.send({});
});

app.listen(4003, () => console.log('Server running on port 4003'));
