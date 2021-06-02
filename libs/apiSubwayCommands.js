const PostMessageToSlack = require('../common/PostMessageToSlack');

const apiSubwayCommand = {
  where: async function(userData, channelId) {
    const { login: userLogin } = userData;
    const { host: userLocation, begin_at, end_at } = userData['0'];
    if (end_at == null) {
        return (`${userLogin}님이 ${userLocation}에 있습니다.`);
    }
    return (`${userLogin}님이 자리에 없습니다.`);
  },
}

module.exports = apiSubwayCommand;