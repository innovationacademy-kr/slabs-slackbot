const { Logging } = require('../models');

function recordLog(body) {
  const {user_name: userName, channel_name: channelName, text} = body;
  let [ command, ...tmpArguments ] = body.text.split(' ');
  const arguments = tmpArguments.toString();
  try {
    Logging.create(
      { 
        user_name: userName,
        channel_name: channelName,
        command: command,
        arguments: arguments
      }
    )
  } catch (err) {
    throw new Error("[ERROR] Logging 레코드 생성 오류입니다.");
  }
}

module.exports = recordLog;