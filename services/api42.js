require('dotenv').config();
const axios = require('axios');
const oauth = require('axios-oauth-client');
const { AccessToken } = require('../models');
const {createModel, updateModel} = require('../common/UseSequelize');

const TOKEN_REQUEST_TIME_OUT = 2500;
const END_POINT_42_API = "https://api.intra.42.fr";

const getToken = async function(){
  const clientCredentials = await getClientCredentials();
  const tmp = { ...clientCredentials };
  const token = tmp.access_token;
  //TODO 토큰 갱신주기 확인해보기
  console.log("# token: ",token);
  return token;
};

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

const api42 = {
  getUserData: async function (req, res, uriPart) {
    useUri = `${END_POINT_42_API}/v2/${uriPart}`;

    try {
      const { token } = await AccessToken.findOne().then({where: {id: 1}});
      req.session.token = token;
      console.log("# token from database: ", token);
    } catch (error) {
      req.session.token = await getToken();
      console.log("초기 DB 토큰: ", req.session.token);
      await createModel(AccessToken, req.session.token);
      throw new Error('🖥 서버가 정보를 갱신했습니다! 한번 더 입력해주세요😇🤗');
    }

    if (req.session.token === null) {
      const newToken = await getToken();
      console.log("# renew token", newToken);
      await updateModel(AccessToken, newToken);
      req.session.token = newToken;
    }

    try {
      const response = await axios.all([axios42(req.session.token).get(useUri)]);
      ret = { ...response[0].data };
      return ret;
    } catch (error) {
      await updateModel(AccessToken, null);
      //console.log(error.response.data);
      console.log("# axios42 error status: ", error.response.status);
      // console.log(error.response.headers);
      // NOTE 42 API에서 찾지 못한 경우
      // 1. 없는 intra id인 경우
      // 2. token이 없는 경우
      if (!req.session.token) {
        console.log('서버 갱신');
        throw new Error('🖥 서버가 정보를 갱신했습니다! 한번 더 입력해주세요🤗');
      }
      else {          
        console.log('없는 아이디');
        throw new Error('👻 서버가 없는 아이디를 찾느라 고생중입니다ㅠㅠ');
      }
    }
  }
};

module.exports = api42;