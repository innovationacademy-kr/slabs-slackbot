const { Logging } = require('../models');

function recordLog(body) {
  const {user_name: userName, channel_name: channelName, text} = body;
  console.log(`[log] user_name: ${userName}, channelName: ${channelName}, text: ${text}`);
  let [ command, ...tmpArguments ] = body.text.split(' ');
  const arguments = tmpArguments.toString();
  console.log(`[log] ${command}, arg: ${arguments}`);
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