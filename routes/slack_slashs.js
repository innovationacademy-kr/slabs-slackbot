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
const api42 = require('../services/api42');
const { updateRecord } = require('../common/UseSequelize');

const INTERVAL_TIME = 5000;
const MSEC2SEC = 0.001;
const THRESHOLD = 0.85;

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

// NOTE: 전반적인 동작 과정에 대한 GUIDE LINE
// 1. slack 채팅창으로부터 정보를 받습니다.
// 2. 입력된 메세지를 그대로 유저에게 보여줍니다. (PostMessageToSlack)
// 3. command key에 따라서 유저가 사용할 api를 구분합니다. (classifyApi)
//    -- 등록되지 않은 command key인 경우: 일정시간 뒤에 error를 출력합니다.
// 4. 유저가 원하는 명령어를 사용하기 위한 api의 데이터를 가지고 옵니다. (getApiData)
// 5. 유저가 원하는 command key에 대한 함수를 가지고 옵니다. (getCommand)
// 6. 함수에 대한 결과를 가지고 옵니다. (slackCmd)
//    -- 에러가 발생한 경우: getApiData, getCommand, slackCmd 내부에서 발생하는 에러에 대해 출력합니다.
router.post('/', async (req, res, next) => {
  const { body } = req;
  const { channel_id: channelId } = body;
  const [ cmdKey ] = body.text.split(' ', 1);
  const messagePromise = PostMessageToSlack(`👌 ❰${body.text}❱ 명령을 입력하셨어요🤩`, channelId);
  let apiType;

  // FIXME: access token 갱신============================================
  // 시작할 때 한번만 수행해야됨
  // 이벤트가 누적되면 안됨
  if (!global.flag) {
    //getTokenFromDB를 일단 해와야할듯
    global.setInterval(periodicFetchToken, INTERVAL_TIME);
    global.flag = true;
  }

  async function periodicFetchToken() {
    const timeGap = (Date.now() - global.timeAfterUpdatingToken) * MSEC2SEC;
    if (timeGap > req.session.expireTime * THRESHOLD) {
      console.log("# AccessToken time out! => Called periodicFetchToken!");
      api42.setTokenToDB(req, updateRecord);
    } else {
      console.log("# [DEBUG] time gap: ", timeGap);
    }
  }

  global.timeAfterUpdatingToken = global.timeAfterUpdatingToken == undefined ? Date.now() : global.timeAfterUpdatingToken;

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