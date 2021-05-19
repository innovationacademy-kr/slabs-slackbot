require('dotenv').config();
const express = require('express');
const router = express.Router();
const postMessageToSlack = require('../common/postMessageToSlack');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

const useApi42 = require('../libs/useApi42');
const useApiNone = require('../libs/useApiNone');

// NOTE API를 미리 구분
async function classifyApi(cmdKey) {
  if (useApi42.isApiCommand(cmdKey)) {
    return (useApi42);
  } else if (useApiNone.isApiCommand(cmdKey)) {
    return (useApiNone);
  } else {
    return (undefined);
  }
}

router.post('/', async (req, res, next) => {
  const body = req.body;
  const channelId = body.channel_id;
  const cmdKey = body.text.split(' ', 1)[0];

  const apiType = await classifyApi(cmdKey);
  if (typeof apiType !== 'object') {
    await res.status(404).send('');
    postMessageToSlack("잘못된 명령어를 입력하셨습니다.", channelId);
    return ;
  }

  const apiData = await apiType.run(res, body);
  // if (apiData === undefined)
  //   return;
  const slackCmd = await apiType.getCommand(cmdKey);
  result = await slackCmd(apiData, channelId);
  await res.status(200).send(result);
});

module.exports = router;