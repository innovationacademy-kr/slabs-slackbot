const axios = require('axios');
const oauth = require('axios-oauth-client');
const { AccessToken } = require('../models');
const { findRecord, createRecord, updateRecord } = require('../common/UseSequelize');

const TOKEN_REQUEST_TIME_OUT = 2500;
const END_POINT_42_API = "https://api.intra.42.fr";

const axios42 = function (accessToken) {
  return (
    axios.create({
    baseURL: END_POINT_42_API,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    timeout: TOKEN_REQUEST_TIME_OUT,
    })
  );
};

const getClientCredentials = oauth.client(axios.create(), {
  url: 'https://api.intra.42.fr/oauth/token',
  grant_type: 'client_credentials',
  client_id: process.env.FORTYTWO_CLIENT_ID,
  client_secret: process.env.FORTYTWO_CLIENT_SECRET,
  scope: 'public'
});

async function getTokenFrom42Api() {
  console.log("# 42API에서 받아오기")
  const { access_token, expires_in } = await getClientCredentials();
  console.log("# renew access token", access_token);
  console.log("# renew limit time", expires_in);
  return [ access_token, expires_in ];
}

async function getTokenFromDB(req) {
  const { access_token: accessToken, expires_in: expireTime } = await findRecord(AccessToken, {where: {id: 1}});
  [ req.session.accessToken, req.session.expireTime ] = [ accessToken, expireTime ];
  console.log("# Updated access token from DB", req.session.accessToken);
  console.log("# Updated expired time from DB", req.session.expireTime)

  if (req.session.accessToken === null) {
    [ req.session.accessToken, req.session.expireTime ] = await getTokenFrom42Api();
    console.log("# Updated access token from 42Api", req.session.accessToken);
    console.log("# Updated expired time from 42Api", req.session.expireTime)
    await updateRecord(AccessToken, req.session);
  }
}

// NOTE: Access Token 및 api 정보를 가지고오는 과정에 대한 GUIDLINE 
// 1. Access token과 만료 시간을 DB로부터 받아옵니다.(getTokenFromDB)
//    -- accessToken이 없는 경우: 42 api로부터 토큰과 만료시간을 받아온(getTokenFrom42Api) 후, DB에 저장합니다.
//       (DB가 처음 생긴 경우 및 token이 만료된 경우로 간주합니다.)
//    -- accessToken이 있는 경우: 2. 42 api로부터 정보를 받아옵니다.
//
// 2. 42 api로부터 정보를 받아옵니다.
//    -- 에러가 없는 경우: 3. uri에 대한 정보를 반환합니다.
//    -- 에러가 있는 경우: 에러 코드를 확인합니다.
//                     -- 401인 경우: 토큰이 만료된 경우로, access token을 갱신합니다.
//                     -- 404인 경우: 사용자가 없는 아이디를 입력하여 발생하는 에러임을 나타냅니다.
const MSEC2SEC = 0.001;
const SEC2MSEC = 1000;
const THRESHOLD = 1.05;
const INTERVAL_TIME = 60 * 5 * SEC2MSEC;

const api42 = {
  fetchToken: async function (req) {
    global.timeAfterUpdatingToken = global.timeAfterUpdatingToken == undefined ? Date.now() : global.timeAfterUpdatingToken;
    const timeGap = (Date.now() - global.timeAfterUpdatingToken) * MSEC2SEC;
    console.log("expire time: ", req.session.expireTime);
    if (timeGap > req.session.expireTime * THRESHOLD) {
      console.log("# AccessToken time out! => Called periodicFetchToken!");
      this.setTokenToDB(req, updateRecord);
    } else {
      console.log("# [DEBUG] [", Date(), "] time gap: ", timeGap);
    }
  },
  setTokenToDB: async function (req, sequelizeRecordAction) {
    [ req.session.accessToken, req.session.expireTime ] = await getTokenFrom42Api();
    await sequelizeRecordAction(AccessToken, req.session); // 비동기적으로 DB 갱신
    console.log("# Updated access token from 42Api", req.session.accessToken);
    console.log("# Updated expired time from 42Api", req.session.expireTime)
    global.timeAfterUpdatingToken = Date.now();
  }, 
  getUserData: async function (req, res, uriPart) {
    const reqUri = `${END_POINT_42_API}/v2/${uriPart}`;

    try {
      await getTokenFromDB(req);
    } catch (error) {
      this.setTokenToDB(req, createRecord);
      console.log("# Initialized access token from DB: ", req.session.accessToken)
      console.log("# Initilaized expired time from DB: ", req.session.expireTime);
      throw new Error('🖥 서버가 토큰을 처음 받습니다! 명령어를 한번 더 입력해주세요😊');
    }

    try {
      const api42Response = await axios.all([axios42(req.session.accessToken).get(reqUri)]);
      ret = { ...api42Response[0].data };
      return ret;
    } catch (error) {
      // console.log("# axios42 error status: ", error.response.status);
      // NOTE 1. token이 만료된 경우, 2. 없는 intra id인 경우
      if (isNaN(error.response.status)) {
        throw new Error('읭? 첨보는 에러에요ㅠㅠ');
      }
      if (error.response.status === 401) {
        this.setTokenToDB(req, updateRecord);
        console.log("# Updated access token from 42Api", req.session.accessToken);
        console.log("# Updated expired time from 42Api", req.session.expireTime)
        throw new Error('🖥 서버가 정보를 갱신했습니다! 명령어를 한번 더 입력해주세요🤗');
      } else if (error.response.status === 404) {          
        console.log('# invalid intra_id 입력');
        throw new Error('👻 서버가 없는 아이디를 찾느라 고생중입니다😭');
      } else {
        throw new Error('읭? 첨보는 에러에요ㅠㅠ');
      }
    }
  }
};

module.exports = api42;