const apiNoneCommands = require('./apiNoneCommands');
const postMessageToSlack = require('../common/postMessageToSlack');

// TODO 새로운 함수가 추가될 때마다 파일로 관리해서 기입하는 방식으로
const partA = ['help','mail'];

const useApiNone = {
  isApiCommand: function(cmdKey) {
	console.log(cmdKey);
    const partAll = [...partA];
    if (partAll.includes(cmdKey) === false) {
      console.log("None :" + cmdKey, " is not key in 42API");
      return false;
    }
    return true;
  },
  getCommand: function(cmdKey) {
    console.log(cmdKey);
    const cmdMap = {
      'help': apiNoneCommands.help,
      'mail': apiNoneCommands.mail,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  run: async function (res, bodyText) {
    userData = null;
    return userData;
  }
}

module.exports = useApiNone;