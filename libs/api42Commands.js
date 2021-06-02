const PostMessageToSlack = require('../common/PostMessageToSlack');

// TODO command 각각에 대한 파일을 나눠서 require 하는 방식으로 (api 폴더 나누기)
const api42Commands = {
  where: async function(userData, channelId) {
    const { login: userLogin } = userData;
    const { host: userLocation, begin_at, end_at } = userData['0'];
    if (end_at == null) {
        return (`${userLogin}님이 ${userLocation}에 있습니다.`);
    }
    return (`${userLogin}님이 자리에 없습니다.`);
  },
  blackhole: async function(userData, channelId) {
    const { login: userLogin } = userData;
    const { blackholed_at } = userData.cursus_users[1];

    const absorptionDate = new Date(blackholed_at);
    const todayDate = new Date();
    restOfDay = Math.floor((absorptionDate - todayDate) / 1000 / 60 / 60 / 24);

    if (restOfDay > 100) {
      return (`✨ ${userLogin}님은 블랙홀이 ${restOfDay}일 남았어요☀ ️`);
    } else if (restOfDay > 50) {
      return (`✨ ${userLogin}님은 블랙홀이 ${restOfDay}일 남았어요 🌏`);
    } else if (restOfDay > 30) {
      return (`✨ ${userLogin}님은 블랙홀이 ${restOfDay}일 남았어요 🪐`);
    } else if (restOfDay > 10) {
      return (`✨ ${userLogin}님은 진정한 블랙홀 피시너!\n️➡️ ${restOfDay}일 남았어요 🏄‍♂️`);
    } else if (restOfDay >= 0) {
      return (`✨ ${userLogin}님 급할수록! 서둘러요.. 파이팅 파이팅 🤞\n➡️️ ${restOfDay}일️🙀 남았어요 🌚`);
    }
    return (`✨ ${userLogin}님은 다른 멋진 곳에 계십니다! 🙌`);
  },
  salary: async function(userData, channelId) {
    let message;
    let userScore = 0;
    const userLogin = userData.login;
    if (userData[0] !== undefined)
      userScore = userData[0].score;
    if (userScore * 1 >= 100) 
      return(`${userLogin}님 ${userScore}점 입니다.\n🎊지원금 수령 가능 합니다.🥳`);
    return (`${userLogin}님 ${userScore}점 입니다.\n💸지원금 수령 불가능 합니다.😢`);
  }
}

module.exports = api42Commands;