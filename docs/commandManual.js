const slackCmd = '/bot';

module.exports = commandManual = {
   '카뎃의 위치를 조회합니다.'
   : `${slackCmd} where {intra_id}`,
   '코알리숑 포인트를 조회합니다.(지원금 수급 여부)'
   : `${slackCmd} salary {intra_id}`,
   '문의메일 주소를 받습니다.'
   : `${slackCmd} mail`,
   '운영팀에게 기능 추가를 건의합니다.'
   : `${slackCmd} suggest {건의할 내용(띄어쓰기 사용 가능)}`,
   '식사 메뉴를 정해줍니다.'
   : `${slackCmd} menu`,
   '비밀(?)을 알려줍니다.'
   : `${slackCmd} secret`,
   '로또 번호를 무작위로 추첨해줍니다.'
   : `${slackCmd} lotto`,
   'slabs-slackbot github 페이지를 봅니다.'
   : `${slackCmd} github`, 
};