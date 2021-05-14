const postMessageToSlack = require('../common/postMessageToSlack');

const slashCommands = {
  where: async function(userData, username, channelId) {
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
    if(userData.login === username) {
        console.log(`인사 메시지 수신 channel:${channelId}`);
        postMessageToSlack(message, channelId);
    }
  },
  salary: async function(userData, username, channelId) {
    let message;
    let userScore = 0;
    if (userData[0] !== undefined)
      userScore = userData[0].score;
    if (userScore * 1 >= 100) {
      message = `${username}님 ${userScore}점 입니다..\n지원금 수령 가능 합니다.`;
    } else if (userScore * 1 < 100) {
      message = `${username}님 ${userScore}점 입니다..\n지원금 수령 불가능 합니다.`;
      console.log(`=====${userScore}점... 지원금 수령 불가=====`);
    }
    postMessageToSlack(message, channelId);
  }
}

module.exports = slashCommands;