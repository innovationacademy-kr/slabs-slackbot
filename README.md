# 42vin
## 명령어
- 클러스터 내 카뎃의 위치를 조회합니다.  
  `/bot where {intra_id}`
- 코알리숑 포인트를 조회합니다.  
  `/bot salary {intra_id}`
- 문의메일 주소를 받습니다.  
  `/bot mail`
- bot 사용법에 대한 내용을 조회합니다.  
  `/bot help`
- github 주소를 가르쳐줍니다.  
  `/bot github`
- 운영팀에게 기능 추가를 건의합니다.  
  `/bot suggest {건의할 내용(띄어쓰기 사용가능)}`
- 식사 메뉴를 정해 줍니다.  
  `/bot menu`
- 비밀(?)을 알려 줍니다.  
  `/bot secret`
- 로또 번호를 무작위 추첨해 줍니다.  
  `/bot lotto`  
- 블랙홀까지 남은 기간을 가르쳐줍니다.
  `/bot blackhole {intra_id}`  

## 42 API app 및 Slack API 봇 생성하기
### intra 42에서 앱등록하기(UID, SECRET, REDIRECT URI 받기)
  - [42 intra API application page](https://profile.intra.42.fr/oauth/applications)
  - `REGISTER A NEW APP` -> `Redirect URI` 기입 -> YOUR APPLICATIONS에서 생성된 앱 확인
  - 생성된 앱에 들어가면, UID, SECRET, REDIRECT URI를 받을 수 있습니다.
### Slack API에서 테스트용 슬랙봇 생성하기(BOT TOKEN 받기)
  - [Slack API page](https://api.slack.com)에 `create a custom app`(초록색 버튼)을 눌러 봇을 생성합니다.
  - ***Features***(왼쪽배너)에 있는 OAuth & permision의 `Bot User OAuth Token`을 받을 수 있습니다.
### 테스트용 슬랙봇에 기능 추가하기
  - ***Features***(왼쪽배너)에 `Event Subscriptions` 혹은 `Slash Commands` 기능을 사용할 수 있습니다.
  - 각 기능을 사용하기 위해서 기능을 켜고 서비스 URL(aws, heroku와 같은)을 `Request URL`에 등록합니다.

## .env 파일 설정하기
  1. 생성된 42API app의 UID, SECRET, REDIRECT URI를 기입합니다.
  2. 슬랙봇의 BOT TOKEN을 기입합니다.
  3. 사용할 PORT 번호를 기입합니다.

## 빌드
```shell
git clone https://github.com/innovationacademy-kr/slabs-slackbot
cd slabs-slackbot
npm i
cp .env.sample .env
npm start
```

## Reference
### Wiki
https://github.com/innovationacademy-kr/slabs-slackbot/wiki
### project process
https://docs.google.com/document/d/14dmZbaVGoxXbMZtK8UFjqoHdiIOVUmBIH3-m-oGbrt0/edit
### Repository
https://github.com/innovationacademy-kr/slabs-slackbot
