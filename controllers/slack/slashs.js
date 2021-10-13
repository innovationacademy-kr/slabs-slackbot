const schedule = require('node-schedule');
const PostMessageToSlack = require('../../common/PostMessageToSlack');

const useApi42 = require('../../libs/useApi42');
const useApiSubway = require('../../libs/useApiSubway');
const useApiNone = require('../../libs/useApiNone');
const api42 = require('../../services/api42');
const recordLog = require('../../libs/recordLog');

async function classifyApi(cmdKey) {
    if (useApi42.isApiCommand(cmdKey)) {
        return (useApi42);
    } else if (useApiSubway.isApiCommand(cmdKey)){
        return (useApiSubway);
    } else if (useApiNone.isApiCommand(cmdKey)) {
        return (useApiNone);
    }
    throw new Error('🤖 없는 명령어를 입력하셨어요.😭\n함께 많은 기능을 만들어보아요🤩');
}

// NOTE: 전반적인 동작 과정에 대한 GUIDE LINE
// 1. slack 채팅창으로부터 정보를 받습니다.
// 2. 입력된 메세지를 그대로 유저에게 보여줍니다. (PostMessageToSlack)
// 3. command key에 따라서 유저가 사용할 api를 구분합니다. (classifyApi)
//    -- 등록되지 않은 command key인 경우: 일정시간 뒤에 error를 출력합니다.
// 4. 유저가 원하는 명령어를 사용하기 위한 api의 데이터를 가지고 옵니다. (getApiData)
// 5. 유저가 원하는 command key에 대한 함수를 가지고 옵니다. (getCommand)
// 6. 함수에 대한 결과를 가지고 옵니다. (slackCmd)
//    -- 에러가 발생한 경우: getApiData, getCommand, slackCmd 내부에서 발생하는 에러에 대해 출력합니다.
exports.handleSlashs = async function (req, res, next) {
    const { body } = req;
    recordLog(body);
    const { channel_id: channelId } = body;
    const [ cmdKey ] = body.text.split(' ', 1);
    const messagePromise = PostMessageToSlack(`👌 ❰${body.text}❱ 명령을 입력하셨어요🤩`, channelId);

    // NOTE: 시작할 때 한번만 수행해야되므로(이벤트 누적을 막기 위해) flag 사용.
    if (!global.flag) {
        const scheduler = schedule.scheduleJob('*/30 * * * * *', function() {
            api42.fetchToken(req);
        });
        global.flag = true;
    }

    let apiType;
    try {
        apiType = await classifyApi(cmdKey);
    } catch (error) {
        await messagePromise;
        setTimeout(() => { res.status(200).send(error.message); }, 1000);
        return ;
    }

    try {
        const apiData = await apiType.getApiData(req, res, body);
        const slackCmd = await apiType.getCommand(cmdKey);
        const result = await slackCmd(apiData, channelId);

        await messagePromise;
        res.status(200).send(result);
    } catch (error) {
        console.error(error.message);
        res.status(200).send(error.message);
    }
}