const PostMessageToSlack = require('../common/PostMessageToSlack');

const apiSubwayCommand = {
  subway: async function(subwayData, channelId) {
    let message = '';
    const { data: { realtimeArrivalList: arrivalList } } = subwayData;
    arrivalList.forEach(function(item) {
      const { trainLineNm, arvlMsg2 } = item;
      message += `${trainLineNm}, ${arvlMsg2}\n`; 
    })
    return (message);
  },
}

module.exports = apiSubwayCommand;