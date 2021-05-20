const apiNoneCommands = require('./apiNoneCommands');
const postMessageToSlack = require('../common/postMessageToSlack');

// TODO 새로운 함수가 추가될 때마다 파일로 관리해서 기입하는 방식으로
const partA = ['help', 'mail', 'request'];

const useApiNone = {
  isApiCommand: function(cmdKey) {
    const partAll = [...partA];
    if (partAll.includes(cmdKey) === false) {
      console.log("None :" + cmdKey, " is not key in nonAPI");
      return false;
    }
    return true;
  },
  getCommand: function(cmdKey) {
    const cmdMap = {
      'help': apiNoneCommands.help,
      'mail': apiNoneCommands.mail,
      'request': apiNoneCommands.request,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  run: async function (res, body) {
    let apiNoneData = body.text.split(' ')[1];
    if (apiNoneData === undefined)
      return "empty string";
    return apiNoneData;
  }
}

module.exports = useApiNone;