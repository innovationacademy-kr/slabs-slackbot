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

const getToken = (async function(){
  const { access_token: accessToken } = await getClientCredentials();
  console.log("# token: ", accessToken);
  return accessToken;
});

const api42 = {
  getUserData: async function (req, res, uriPart) {
    const reqUri = `${END_POINT_42_API}/v2/${uriPart}`;

    try {
      //const { token: accessToken } = await AccessToken.findOne().then({where: {id: 1}});
      const { token: accessToken } = await findRecord(AccessToken, {where: {id: 1}});
      req.session.token = accessToken;
      console.log("# token from database: ", req.session.token);
    } catch (error) {
      req.session.token = await getToken();
      console.log("초기 DB access token 토큰: ", req.session.token);
      await createRecord(AccessToken, req.session.token);
      throw new Error('🖥 서버가 정보를 갱신했습니다! 한번 더 입력해주세요😊');
    }

    if (req.session.token === null) {
      const newAccessToken = await getToken();
      console.log("# renew access token", newAccessToken);
      await updateRecord(AccessToken, newAccessToken);
      req.session.token = newAccessToken;
    }

    try {
      const api42Response = await axios.all([axios42(req.session.token).get(reqUri)]);
      ret = { ...api42Response[0].data };
      return ret;
    } catch (error) {
      await updateRecord(AccessToken, null);
      console.log("# axios42 error status: ", error.response.status);
      // NOTE 1. token이 잘못된 경우, 2. 없는 intra id인 경우
      if (error.response.status === 401) {
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