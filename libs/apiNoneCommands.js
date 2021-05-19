const postMessageToSlack = require('../common/postMessageToSlack');

// TODO command 각각에 대한 파일을 나눠서 require 하는 방식으로 (api 폴더 나누기)
const apiNoneCommands = {
  mail : async function(apiData, channelId) {
    const message = "born2code@42seoul.kr";
    // postMessageToSlack(message, channelId);
    return message;
  },
  help : async function(apiData, channelId) {
    const message = "https://github.com/innovationacademy-kr/slabs-slackbot";
    // postMessageToSlack(message, channelId);
    return message;
  },
  request : async function(apiData, channelId) {
    const message = "요청이 잘 전달 되었습니다.";
    // postMessageToSlack(message, channelId);
    return message;
  }
}

module.exports = apiNoneCommands;