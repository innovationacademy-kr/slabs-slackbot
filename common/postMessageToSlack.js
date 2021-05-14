const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token); 

const postMessageToSlack = async (textMessage, channelId) => {
  web.chat.postMessage({
    channel: channelId,
    text: textMessage,
  }).then(result => {
    console.log('Message sent: ' + result.ts)
  });
}

module.exports = postMessageToSlack;