const express = require('express');
const router = express.Router();
const PostMessageToSlack = require('../../common/PostMessageToSlack');

const token = process.env.SLACK_TOKEN;

const getEventCallBackResponse = (event) => {
  if (event.type === 'message') {
    if(event.text === '안녕') {
      return ("안녕하세요!");
    } else if(event.text === '안녕하세요') {
      return ("오냐!");
    } else {
      return (undefined);
    }
  }
}

router.post('/', async (req, res, next) => {
  const { body } = req;
  const { event, type, challenge } = body;
  const { channel: channelId } = event;

  if (type === 'event_callback') {
    const message = await getEventCallBackResponse(event);
    if (message !== undefined) {
      console.log("# event subscription message printed: ", message);
      PostMessageToSlack(message, channelId)
      res.status(200).send(message);
      return ;
    }
  } else if(type === 'url_verification') {
    console.log('url verification')
    res.send(challenge);
  }
  res.sendStatus(200);
});

module.exports = router;