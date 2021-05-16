const api42 = require('../services/api42');
const api42Commands = require('./api42Commands');
const postMessageToSlack = require('../common/postMessageToSlack');

// TODO 새로운 함수가 추가될 때마다 파일로 관리해서 기입하는 방식으로
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

const getUserData = async (res, uriPart, channelId) => {
  let userData;
  try {
    userData = await api42.getUserData(uriPart);
  } catch (err) {
    /*
    const error = new Error("[user.js] getUserData: " + err.message);
    error.status = (err.response) ? err.response.status : 500;
    if (error.status === 401) {
      res.status(200).send('401');
      message = '요청 시간 초과..';
    } else if (error.status === 404) {
      res.status(200).send('404');
      message = '아이디를 바르게 입력 바랍니다..';
      //return;
    }
    postMessageToSlack(message, channelId);
    //return;
  */
    return;
  }
  return userData;
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
    const cmdMap = {
      'where': api42Commands.where,
      'salary': api42Commands.salary,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  run: async function (res, bodyText) {
    const channelId = bodyText.chnnel_id;
    const tmpStrArr = bodyText.split(' ', 2);
    [cmdKey, userName] = [tmpStrArr[0], tmpStrArr[1]];

    if (this.isApiCommand(cmdKey) === false)
    {
        console.log(`Error: ${cmdKey} is not cmd in 42API!`);
        res.sendStatus(200, '없는 명령어입니다.').send('404');
    }
    const uriPart = await getUriPart(cmdKey, userName);
    const userData = await getUserData(res, uriPart, channelId);
    if (userData !== undefined)
      userData.login = userName;
    return userData;
  }
}

module.exports = useApi42;