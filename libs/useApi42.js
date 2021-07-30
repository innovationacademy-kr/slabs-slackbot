const api42 = require('../services/api42');
const api42Commands = require('./api42Commands');
const PostMessageToSlack = require('../common/PostMessageToSlack');

// 기능 추가: 추가하고 싶은 42api 관련 명령어를 작성해주세요
const commands = ['where', 'blackhole', 'salary'];

const getUriPart = async (cmdKey, userName) => {
  // 기능 추가: 추가하고 싶은 42api를 위해 사용하는 uri를 매치 시켜주세요
  const uriMap = {
    'where': `/users/${userName}/locations`,
    'blackhole': `/users/${userName}`,
    'salary': `/users/${userName}/coalitions_users`
  }
  return (uriMap[cmdKey] ? uriMap[cmdKey] : undefined);
}

const useApi42 = {
  isApiCommand: function(cmdKey) {
    if (commands.includes(cmdKey) === false) {
      return false;
    } 
    return true;
  },
  getCommand: function(cmdKey) {
    // 추가: api42Commands에 원하는 함수를 추가하고 이를 명령어와 매치 시켜주세요
    const cmdMap = {
      'where': api42Commands.where,
      'blackhole': api42Commands.blackhole,
      'salary': api42Commands.salary,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  getApiData: async function (req, res, body) {
    const {text: bodyText, channel_id: bodyChannelId} = body;
    const [cmdKey, userName] = bodyText.split(' ', 2);
    const uriPart = await getUriPart(cmdKey, userName);

    const userData = await api42.getUserData(req, res, uriPart);
    userData.login = userName;
    return userData;
  }
}

module.exports = useApi42;