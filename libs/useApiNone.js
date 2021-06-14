const apiNoneCommands = require('./apiNoneCommands');
const PostMessageToSlack = require('../common/PostMessageToSlack');

// TODO 새로운 함수가 추가될 때마다 파일로 관리해서 기입하는 방식으로
const partA = ['help', 'mail', 'github','suggest', 'lotto', 'menu', 'secret'];

const useApiNone = {
  isApiCommand: function(cmdKey) {
    const partAll = [...partA];
    if (partAll.includes(cmdKey) === false) {
      return false;
    }
    return true;
  },
  getCommand: function(cmdKey) {
    const cmdMap = {
      'help': apiNoneCommands.help,
      'mail': apiNoneCommands.mail,
      'github': apiNoneCommands.github,
      'suggest': apiNoneCommands.suggest,
      'lotto' : apiNoneCommands.lotto,
      'menu' : apiNoneCommands.menu,
      'secret' : apiNoneCommands.secret,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  getApiData: async function (req, res, body) {
    let apiNoneData = body.text;
    const tmpIdx = apiNoneData.indexOf(' ');
    if (tmpIdx < 0)
      return "empty string";
    apiNoneData = apiNoneData.substr(tmpIdx);
    return apiNoneData;
  }
}

module.exports = useApiNone;