require('dotenv').config();
const express = require('express');
const router = express.Router();
//const { WebClient } = require('@slack/web-api');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//const token = process.env.SLACK_TOKEN;
//const web = new WebClient(token); 

const getUserData = require('../libs/getUserData');
const slashCommands = require('../libs/slashCommands');

const getApi42UriPart = function (key, username) {
  let uriPart
  const partA = ['/where'];
  const partB = ['/salary'];

  if (partA.includes(key))
    uriPart = `/users/${username}`;
  else if (partB.includes(key))
    uriPart = `/users/${username}/coalitions_users`;
  else
    uriPart = null;
  return uriPart;
}

const getSlackCommand = function(key) {
  const cmdMap = {
    '/where': slashCommands.where,
    '/salary': slashCommands.salary,
  }
  return (cmdMap[key]) ? cmdMap[key] : key;
}

router.post('/', async (req, res, next) => {
  const body = req.body;
  const slashCommand = body.command;
  const slashText = body.text;
  const channelId = body.channel_id;

  const uriPart = getApi42UriPart(slashCommand, slashText);
  if (uriPart === null)
    res.sendStatus(200, '없는 명령어입니다.').send('404');

  const userData = await getUserData(res, uriPart, channelId);

  //const key = (req.body) ? req.body.text : '';
  let result;
  const slackCmd = getSlackCommand(slashCommand);
  if (typeof slackCmd === 'function') {
    result = await slackCmd(userData, slashText, channelId);
    res.sendStatus(200, '');
  } else {
    result = '🤖Hmm... but don’t panic!';
    res.sendStatus(200, 'Error: slash command error.');
  }
});

module.exports = router;