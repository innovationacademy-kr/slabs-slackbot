const api42 = require('../services/api42');
const api42Commands = require('./api42Commands');

const getApi42 = {
  partA: ['where'],
  partB: ['salary'],
  slackCommand: function(cmdKey) {
    const cmdMap = {
        'where': api42Commands.where,
        'salary': api42Commands.salary,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  getUriPart: async function (cmdKey, userName) {
    const partAll = [...this.partA, ...this.partB];
    if (partAll.includes(cmdKey) === false) {
      console.log(cmdKey, " is not key in 42API");
      return ;
    }
    let uriPart;
    if (this.partA.includes(cmdKey))
      uriPart = `/users/${userName}`;
    else if (this.partB.includes(cmdKey))
      uriPart = `/users/${userName}/coalitions_users`;
    if (uriPart === undefined) {
      res.sendStatus(200, '없는 명령어입니다.').send('404');
      return ;
    }
    return uriPart
  },
  getUserData: async (res, uriPart, channelId) => {
    let userData;
    try {
      userData = await api42.getUserData(uriPart);
    } catch (err) {
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
    }
    return userData;
  },
  run: async function (res, bodyText) {
    const channelId = bodyText.chnnel_id;
    const tmpStrArr = bodyText.split(' ', 2);
    [cmdKey, userName] = [tmpStrArr[0], tmpStrArr[1]];
  
    const uriPart = await this.getUriPart(cmdKey, userName);
    const userData = await this.getUserData(res, uriPart, channelId);
    userData.login = userName;
    return userData;
  }
}

module.exports = getApi42;