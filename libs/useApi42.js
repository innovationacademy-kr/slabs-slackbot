const api42 = require('../services/api42');
const api42Commands = require('./api42Commands');
const postMessageToSlack = require('../common/postMessageToSlack');

const partA = ['where', 'blackhole'];
const partB = ['salary'];

const getUriPart = async (cmdKey, userName) => {
  let uriPart;
  if (partA.includes(cmdKey))
    uriPart = `/users/${userName}`;
  else if (partB.includes(cmdKey))
    uriPart = `/users/${userName}/coalitions_users`;
  return uriPart
}

const useApi42 = {
  isApiCommand: function(cmdKey) {
    const partAll = [...partA, ...partB];
    if (partAll.includes(cmdKey) === false) {
      return false;
    } 
    return true;
  },
  getCommand: function(cmdKey) {
    console.log("# input command: ", cmdKey);
    const cmdMap = {
      'where': api42Commands.where,
      'blackhole': api42Commands.blackhole,
      'salary': api42Commands.salary,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  run: async function (res, body) {
    const {text: bodyText, channel_id: bodyChannelId} = body;
    const [cmdKey, userName] = bodyText.split(' ', 2);

    const uriPart = await getUriPart(cmdKey, userName);

    try {
      const userData = await api42.getUserData(res, uriPart);
      userData.login = userName;
      return userData;
    } catch (error) {
      throw new Error("👻 서버가 없는 아이디를 찾느라 고생중입니다ㅠㅠ");
    }
  }
}

module.exports = useApi42;