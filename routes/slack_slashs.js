require('dotenv').config();
const express = require('express');
const router = express.Router();
const PostMessageToSlack = require('../common/PostMessageToSlack');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const useApi42 = require('../libs/useApi42');
const useApiSubway = require('../libs/useApiSubway');
const useApiNone = require('../libs/useApiNone');

// NOTE 사용할 API 구분
async function classifyApi(cmdKey) {
  if (useApi42.isApiCommand(cmdKey)) {
    return (useApi42);
  } else if (useApiSubway.isApiCommand(cmdKey)){
    return (useApiSubway);
  } else if (useApiNone.isApiCommand(cmdKey)) {
    return (useApiNone);
  }
  throw new Error('🤖 없는 명령어를 입력하셨어요.😭\n함께 많은 기능을 만들어보아요🤩');
}

router.post('/', async (req, res, next) => {
  const { body } = req;
  const { channel_id: channelId } = body;
  const [ cmdKey ] = body.text.split(' ', 1);

  const messagePromise = PostMessageToSlack(`👌 ❰${body.text}❱ 명령을 입력하셨어요🤩`, channelId);
  let apiType;
  try {
    apiType = await classifyApi(cmdKey);
  } catch (error) {
    setTimeout(() => { res.status(200).send(error.message); }, 1000);
    return ;
  }
    
  try {
    const apiData = await apiType.getApiData(req, res, body);
    const slackCmd = await apiType.getCommand(cmdKey);
    result = await slackCmd(apiData, channelId);
    await messagePromise;
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(200).send(error.message.substr(7));
  }
});

module.exports = router;