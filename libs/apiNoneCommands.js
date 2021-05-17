const postMessageToSlack = require('../common/postMessageToSlack');

// TODO command 각각에 대한 파일을 나눠서 require 하는 방식으로 (api 폴더 나누기)
const apiNoneCommands = {
  mail : async function(userData, channelId) {
    const message = "born2code@42seoul.kr";
    postMessageToSlack(message, channelId);
  },
  help : async function(userData, channelId) {
    const message = "https://github.com/innovationacademy-kr/slabs-slackbot";
    postMessageToSlack(message, channelId);
  }
}

module.exports = apiNoneCommands;