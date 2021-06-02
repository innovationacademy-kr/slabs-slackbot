const api42 = require('../services/api42');
const api42Commands = require('./api42Commands');
const PostMessageToSlack = require('../common/PostMessageToSlack');

const commands = ['where', 'blackhole', 'salary'];

const getUriPart = async (cmdKey, userName) => {
  const uriMap = {
    '도착': `/users/${userName}/locations`,
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
    try {
      const userData = await api42.getUserData(req, res, uriPart);
      userData.login = userName;
      return userData;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = useApi42;