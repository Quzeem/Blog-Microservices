const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Events data store
const events = [];

app.post('/events', (req, res) => {
  // event is the piece of information recieved from a service
  const event = req.body;

  // add every occurence of an event to the events data store
  events.push(event);

  // send the piece of info to other services(in need) including the service that emits the event
  axios.post('http://localhost:4000/events', event);
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);
  axios.post('http://localhost:4003/events', event);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log('Server running on port 4005'));
