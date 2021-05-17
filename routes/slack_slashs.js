require('dotenv').config();
const express = require('express');
const router = express.Router();
const postMessageToSlack = require('../common/postMessageToSlack');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// NOTE API를 미리 구분
async function classifyApi(cmdKey) {
  if (useApi42.isApiCommand(cmdKey)) {
    return (useApi42);
  //} else if (useApiNone.isApiCommand()) {
  //  return (undefined);
  } else {
    return (undefined);
  }
}

const useApi42 = require('../libs/useApi42');

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

  // TODO api 선택해서 적용할 수 있도록 각 API에 대한 객체 생성
  const userData = await apiType.run(res, body);
  if (userData === undefined)
    return;

  const slackCmd = await apiType.getCommand(cmdKey);
  result = await slackCmd(userData, channelId);
  await res.status(200).send('');
});

module.exports = router;