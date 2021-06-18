const apiSubway = require('../services/apiSubway');
const apiSubwayCommands = require('./apiSubwayCommands');
const PostMessageToSlack = require('../common/PostMessageToSlack');

const commands = ['subway'];

const getUriPart = async (cmdKey, stationName) => {
  const uriMap = {
    'subway': `json/realtimeStationArrival/0/5/${stationName}`,
  }
  return (uriMap[cmdKey] ? uriMap[cmdKey] : undefined);
}

const useApiSubway = {
  isApiCommand: function(cmdKey) {
    if (commands.includes(cmdKey) === false) {
      return false;
    } 
    return true;
  },
  getCommand: function(cmdKey) {
    const cmdMap = {
      'subway': apiSubwayCommands.subway,
    }
    return (cmdMap[cmdKey]) ? cmdMap[cmdKey] : cmdKey;
  },
  getApiData: async function (req, res, body) {
    const {text: bodyText, channel_id: bodyChannelId} = body;
    const [cmdKey, userName] = bodyText.split(' ', 2);
    const uriPart = await getUriPart(cmdKey, userName);

    try {
      const subwayData = await apiSubway.getSubwayData(req, res, uriPart);
      return subwayData;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = useApiSubway;