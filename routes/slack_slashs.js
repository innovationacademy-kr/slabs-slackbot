require('dotenv').config();
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

const getUserData = require('../libs/getUserData');
const slashCommands = require('../libs/slashCommands');

const getApi42UriPart = function (cmdKey, username) {
  let uriPart
  const partA = ['where'];
  const partB = ['salary'];

  if (partA.includes(cmdKey))
    uriPart = `/users/${username}`;
  else if (partB.includes(cmdKey))
    uriPart = `/users/${username}/coalitions_users`;
  else
    uriPart = null;
  return uriPart;
}

const getSlackCommand = function(cmdKey) {
  const cmdMap = {
    'where': slashCommands.where,
    'salary': slashCommands.salary,
  }
  return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
}

router.post('/', async (req, res, next) => {
  const body = req.body;
  const channelId = body.channel_id;

  const tmpStrArr = body.text.split(' ', 2);
  [cmdKey, username] = [tmpStrArr[0], tmpStrArr[1]];
  console.log("cmdKey: ", cmdKey, "username: ", username);

  let uriPart;
  uriPart = await getApi42UriPart(cmdKey, username);
  if (!uriPart) {
    res.sendStatus(200, '없는 명령어입니다.').send('404');
    return ;
  }
  const userData = await getUserData(res, uriPart, channelId);

  let result;
  const slackCmd = getSlackCommand(cmdKey);
  if (typeof slackCmd === 'function') {
    result = await slackCmd(userData, channelId);
    res.sendStatus(200, '');
  } else {
    result = '🤖Hmm... but don’t panic!';
    res.sendStatus(200, 'Error: slash command error.');
  }
});

module.exports = router;