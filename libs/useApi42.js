const api42 = require('../services/api42');
const api42Commands = require('./api42Commands');
const postMessageToSlack = require('../common/postMessageToSlack');

const partA = ['where'];
const partB = ['salary'];

const getUriPart = async (cmdKey, userName) => {
  let uriPart;
  if (partA.includes(cmdKey))
    uriPart = `/users/${userName}`;
  else if (partB.includes(cmdKey))
    uriPart = `/users/${userName}/coalitions_users`;
  if (uriPart === undefined) {
    res.sendStatus(200, '없는 명령어입니다.').send('404');
  }
  return uriPart
}

const useApi42 = {
  isApiCommand: function(cmdKey) {
    const partAll = [...partA, ...partB];
    if (partAll.includes(cmdKey) === false) {
      console.log(cmdKey, " is not key in 42API");
      return false;
    }
    return true;
  },
  getCommand: function(cmdKey) {
    console.log(cmdKey);
    const cmdMap = {
      'where': api42Commands.where,
      'salary': api42Commands.salary,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  run: async function (res, body) {
    const bodyText = body.text;
    const bodyChannelId = body.channel_id;
    const tmpStrArr = bodyText.split(' ', 2);
    const [cmdKey, userName] = [tmpStrArr[0], tmpStrArr[1]];

    const uriPart = await getUriPart(cmdKey, userName);
    let userData;
    try {
      userData = await api42.getUserData(uriPart);
    } catch (err) {
      userData = undefined;
      res.status(200).send("👻 서버가 없는 아이디를 찾느라 고생중입니다ㅠㅠ");
    }
    if (userData !== undefined)
      userData.login = userName;
    return userData;
  }
}

module.exports = useApi42;