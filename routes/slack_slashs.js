require('dotenv').config();
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

const useApi42 = require('../libs/useApi42');

router.post('/', async (req, res, next) => {
  const body = req.body;
  const channelId = body.channel_id;

  // TODO api 선택해서 적용할 수 있도록 각 API에 대한 객체 생성
  const userData = await useApi42.run(res, body.text);
  if (userData === undefined)
    return;
  let result;
  // FIXME cmdKey??? 무슨일?? 전역?
  const slackCmd = await useApi42.getCommand(cmdKey);
  if (typeof slackCmd === 'function') {
    await res.status(200).send('');
    result = await slackCmd(userData, channelId);
  }
});

module.exports = router;