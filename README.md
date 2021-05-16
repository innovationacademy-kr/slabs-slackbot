# Slack bot
## 환경 설정하기
- UID SECRET
  - intra.42.fr - setting - API -  register a new app - specify redirect URL 
- OAuth BOT TOKEN
  - api.slack.com - create a custom app - add feature(Slash Commands, Bots, Permision) - OAuth & permision
- Install the app on the Slack workspace
## 빌드
```
git clone https://github.com/innovationacademy-kr/slabs-slackbot
cd slabs-slackbot
npm i
cp .env.sample .env
# set up .env values
# open the slack workspace
npm start
# Enter commands in the workspace
```
## 명령어
- 카뎃 클러스태 내 위치 조회
  /{botName} where {intra_id}
- 지원금 수령 가능여부 조회
  /{botName} salary {intra_id}
- 문의에일 링크
  /{botName} mail
- README LINK
  /{botName} help 
### 파일목록
- index.js
- #### common
- #### libs
- #### routes
- #### services
- #### views
- 
# slabs-slackbot
Software Labs Slackbot

## Wiki
https://github.com/innovationacademy-kr/slabs-slackbot/wiki

## project process
https://docs.google.com/document/d/14dmZbaVGoxXbMZtK8UFjqoHdiIOVUmBIH3-m-oGbrt0/edit

## Repository
https://github.com/innovationacademy-kr/slabs-slackbot
