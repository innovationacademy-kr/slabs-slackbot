//const { User } = require('../models');
const { Suggestion } = require('../models');

// TODO command 각각에 대한 파일을 나눠서 require 하는 방식으로 (api 폴더 나누기)
const apiNoneCommands = {
  mail : async function(apiData, channelId) {
    const message = "born2code@42seoul.kr";
    return (message);
  },
  help : async function(apiData, channelId) {
    const message = "https://github.com/innovationacademy-kr/slabs-slackbot";
    return (message);
  },
  suggest : async function(apiData, channelId) {
    let message;
    if (apiData === "empty string") {
      message = "요청사항을 적어주세요.";
    } else {
      Suggestion.create({
        content: `${apiData}`
      }).catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      message = "요청이 잘 전달 되었습니다.";
    }
    return (message);
  }
}

module.exports = apiNoneCommands;