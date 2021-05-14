require('dotenv').config();
const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/web-api');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token); 

const getUserData = require('../libs/getUserData');
const slashCommands = require('../libs/slashCommands');

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

  const userData = await getUserData(slashText, channelId);

  //const key = (req.body) ? req.body.text : '';
  const key = slashCommand;
  const slackCmd = getSlackCommand(key);
  let result;
  if (typeof slackCmd === 'function') {
    result = await slackCmd(userData, slashText, channelId);
    res.sendStatus(200, '');
  } else {
    result = '🤖Hmm... but don’t panic!';
    res.sendStatus(200, 'Error: slash command error.');
  }
});

module.exports = router;