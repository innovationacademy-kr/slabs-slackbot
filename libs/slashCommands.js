const postMessageToSlack = require('../common/postMessageToSlack');

const slashCommands = {
  where: async function(userData, channelId) {
    let message;
    const userLogin = userData.login;
    const userLocation = userData.location;
    if (userLocation) {
        message = `${userLogin}님이 ${userLocation}에 있습니다.`;
    } else if (userLocation === null) {
        message = `${userLogin}님이 자리에 없습니다.`;
    } else {
        message = `Error: userLocation: ${userLocation}, userLogin: ${userLogin}`;
    }
    postMessageToSlack(message, channelId);
  },
  salary: async function(userData, channelId) {
    let message;
    let userScore = 0;
    const userLogin = userData.login;
    if (userData[0] !== undefined)
      userScore = userData[0].score;
    if (userScore * 1 >= 100) {
      message = `${userLogin}님 ${userScore}점 입니다..\n지원금 수령 가능 합니다.`;
    } else if (userScore * 1 < 100) {
      message = `${userLogin}님 ${userScore}점 입니다..\n지원금 수령 불가능 합니다.`;
      console.log(`=====${userScore}점... 지원금 수령 불가=====`);
    }
    postMessageToSlack(message, channelId);
  }
}

module.exports = slashCommands;