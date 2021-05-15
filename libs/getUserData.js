const api42 = require('../services/api42');
const postMessageToSlack = require('../common/postMessageToSlack');

const getUserData = async (res, uriPart, channelId) => {
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
}

module.exports = getUserData;