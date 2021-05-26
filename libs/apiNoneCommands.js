const { Suggestion } = require('../models');
const NumberUtils = require('../common/NumberUtils');
const ArrayUtils = require('../common/ArrayUtils');

// TODO command 각각에 대한 파일을 나눠서 require 하는 방식으로 (api 폴더 나누기)
const apiNoneCommands = {
  mail : async function(apiData, channelId) {
    const message = "born2code@42seoul.kr";
    return (message);
  },
  github : async function(apiData, channelId) {
    const message = "https://github.com/innovationacademy-kr/slabs-slackbot";
    return (message);
  },
  help : async function(apiData, channelId) {
    let resultEntries = Object.entries(require('../docs/commandManual'))
    let message = "";
    for (let[key, value] of resultEntries) {
      message += `${key}\n${value}\n\n`;
    }
    return (message);
  }, 
  suggest : async function(apiData, channelId) {
    let message;
    if (apiData === "empty string") {
      message = "📭 요청 사항이 입력되지 않았어요..🌝\n너무 완벽한건가 hoxy 🏖";
    } else {
      Suggestion.create({
        content: `${apiData}`
      }).catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      message = "📬 빠른 시일내에⏳ 구현하도록💻 노력해보겠습니다! 감사합니다🤓";
    }
    return (message);
  },
  lotto : async function(userData, channelId) {
    let message;
    if (Math.random() > .2) {
      const list = NumberUtils.getRandomList(45, 6);
      message = list.join(', ');
    } else {
      const shuffled = ArrayUtils.shuffle(words);
      message = '코딩이 로또다';
    }
    return (message);
  },
  secret : async function(userData, channelId) {
    const shuffled = ArrayUtils.shuffle(require('../docs/secretSaying'));
    let message = shuffled.pop();
    return (message);
  },
  menu : async function(userData, channelId) {
    const menuList = require('../docs/menuList');
    const menu = ArrayUtils.shuffle(menuList);
    let message = menu.pop();
    return (message);
  }
}

module.exports = apiNoneCommands;