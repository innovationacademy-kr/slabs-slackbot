require('dotenv').config();
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

async function getToken() {
  const { access_token: accessToken, expires_in: expireTime } = await getClientCredentials();
  const tokenTotalInfo = await getClientCredentials();
  return [ accessToken, expireTime ];
}

async function checkToken(req) {
  const { access_token: accessToken, expires_in: expireTime } = await findRecord(AccessToken, {where: {id: 1}});
  [ req.session.accessToken, req.session.expireTime ] = [ accessToken, expireTime ];
  console.log("# accessToken from database: ", req.session.accessToken);
  console.log("# expireTime from database: ", req.session.expireTime);

  if (req.session.accessToken === null) {
    const [newAccessToken, newExpireTime] = await getToken();
    [ req.session.accessToken, req.session.expireTime ] = [ newAccessToken, newExpireTime ];
    console.log("# renew access token", newAccessToken);
    console.log("# renew limit time", newExpireTime);
    await updateRecord(AccessToken, req.session);
  }
}

const api42 = {
  getUserData: async function (req, res, uriPart) {
    const reqUri = `${END_POINT_42_API}/v2/${uriPart}`;

    try {
      await checkToken(req);
    } catch (error) {
      [ req.session.accessToken, req.session.expireTime ] = await getToken();
      console.log("초기 DB access token 토큰: ", req.session.accessToken);
      await createRecord(AccessToken, req.session);
      throw new Error('🖥 서버가 토큰을 처음으로 받습니다! 한번 더 입력해주세요😊');
    }

    try {
      const api42Response = await axios.all([axios42(req.session.accessToken).get(reqUri)]);
      ret = { ...api42Response[0].data };
      return ret;
    } catch (error) {
      console.log("# axios42 error status: ", error.response.status);
      // NOTE 1. token이 만료된 경우, 2. 없는 intra id인 경우
      if (error.response.status === 401) {
        [ req.session.accessToken, req.session.expireTime ] = [ null, null ];
        await updateRecord(AccessToken, req.session);
        console.log('서버 갱신');
        throw new Error('🖥 서버가 정보를 갱신했습니다! 한번 더 입력해주세요🤗');
      } else if (error.response.status === 404) {          
        console.log('없는 아이디');
        throw new Error('👻 서버가 없는 아이디를 찾느라 고생중입니다ㅠㅠ');
      } else {
        throw new Error('읭? 첨보는 에러에요ㅠㅠ');
      }
    }
  }
};

module.exports = api42;