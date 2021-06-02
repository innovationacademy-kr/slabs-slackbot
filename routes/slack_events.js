require('dotenv').config();
const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token); 

const getEventCallBackResponse = async (event) => {
  if (event.type === 'message') {
    if(event.text === '안녕') {
      console.log(`인사 메시지 수신 channel:${event.channel}, user:${event.user}`);
      await web.chat.PostMessage({
        channel: event.channel,
        text: `안녕하세요`
      }).then(result => {
        console.log('Message sent: ' + result.ts)
      });
    }
  }
} 

router.post('/', async (req, res, next) => {
  let body = req.body;
  let event = body.event;

  if (body.type === 'event_callback') {
    getEventCallBackResponse(event);
    res.sendStatus(200);
  } else if(body.type === 'url_verification') {
    console.log('url verification')
    res.send(body.challenge);
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;