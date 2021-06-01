require('dotenv').config();
const express = require('express');
const router = express.Router();
const postMessageToSlack = require('../common/postMessageToSlack');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const useApi42 = require('../libs/useApi42');
const useApiNone = require('../libs/useApiNone');

// NOTE 사용할 API 구분
async function classifyApi(cmdKey) {
  if (useApi42.isApiCommand(cmdKey)) {
    return (useApi42);
  } else if (useApiNone.isApiCommand(cmdKey)) {
    return (useApiNone);
  }
  return ("🤖 없는 명령어를 입력하셨어요.😭\n함께 많은 기능을 만들어보아요🤩");
}

router.post('/', async (req, res, next) => {
  const { body } = req;
  const { channel_id: channelId } = body;
  const [ cmdKey ] = body.text.split(' ', 1);

  const apiType = await classifyApi(cmdKey);
  if (typeof apiType != 'object') {
    res.status(200).send(apiType);
    return ;
  }
    
  try {
    const apiData = await apiType.getApiData(req, res, body);
    const slackCmd = await apiType.getCommand(cmdKey);
    result = await slackCmd(apiData, channelId);
    res.status(200).send(result);
  } catch (error) {
    res.status(200).send(error.message);
  }
});

module.exports = router;