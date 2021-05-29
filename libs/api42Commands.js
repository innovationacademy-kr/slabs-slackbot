const postMessageToSlack = require('../common/postMessageToSlack');

// TODO command 각각에 대한 파일을 나눠서 require 하는 방식으로 (api 폴더 나누기)
const api42Commands = {
  where: async function(userData, channelId) {
    let message;
    const { login: userLogin, location: userLocation} = userData;
    if (userLocation) {
        message = `${userLogin}님이 ${userLocation}에 있습니다.`;
    } else if (userLocation === null) {
        message = `${userLogin}님이 자리에 없습니다.`;
    } else {
        message = `Error: userLocation: ${userLocation}, userLogin: ${userLogin}`;
    }
    return (message);
  },
  blackhole: async function(userData, channelId) {
    let message;
    const { login: userLogin } = userData;
    const { blackholed_at } = userData.cursus_users[1];
    const absorptionDate = new Date(blackholed_at);

    const todayDate = new Date();
    restOfDay = await Math.floor((absorptionDate - todayDate) / 1000 / 60 / 60 / 24);

    if (restOfDay > 100) {
      message = `🤖 ${userLogin}님은 블랙홀이 ${restOfDay}일 남았어요☀ ️`
    } else if (restOfDay > 50) {
      message = `🤖 ${userLogin}님은 블랙홀이 ${restOfDay}일 남았어요 🌏`
    } else if (restOfDay > 30) {
      message = `🤖 ${userLogin}님은 블랙홀이 ${restOfDay}일 남았어요 🪐`
    } else if (restOfDay > 10) {
      message = `🤖 ${userLogin}님은 진정한 블랙홀 피시너!\n️➡️ ${restOfDay}일 남았어요 🏄‍♂️`;
    } else if (restOfDay >= 0) {
      message = `🤖 ${userLogin}님 급할수록! 서둘러요.. 파이팅 파이팅 🤞\n➡️️ ${restOfDay}일️🙀 남았어요 🌚`
    } else {
      message = `🤖 ${userLogin}님은 좋은 카뎃이었습니다..:innocent:`
    }
    return (message);
  },
  salary: async function(userData, channelId) {
    let message;
    let userScore = 0;
    const userLogin = userData.login;
    if (userData[0] !== undefined)
      userScore = userData[0].score;
    if (userScore * 1 >= 100) {
      message = `${userLogin}님 ${userScore}점 입니다.\n🎊지원금 수령 가능 합니다.🥳`;
    } else if (userScore * 1 < 100) {
      message = `${userLogin}님 ${userScore}점 입니다.\n💸지원금 수령 불가능 합니다.😢`;
    }
    return (message);
  }
}

module.exports = api42Commands;