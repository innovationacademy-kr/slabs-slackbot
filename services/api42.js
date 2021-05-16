require('dotenv').config();
const axios = require('axios');
const oauth = require('axios-oauth-client');

const TOKEN_REQUEST_TIME_OUT = 4000;
const END_POINT_42_API = "https://api.intra.42.fr";

const axios42 = function (accessToken) {
  const axios42 = axios.create({
    baseURL: END_POINT_42_API,
    'headers': { 'Authorization': 'Bearer ' + accessToken },
    timeout: TOKEN_REQUEST_TIME_OUT,
  });
  return axios42;
};

const getClientCredentials = oauth.client(axios.create(), {
  url: 'https://api.intra.42.fr/oauth/token',
  grant_type: 'client_credentials',
  client_id: process.env.FORTYTWO_CLIENT_ID,
  client_secret: process.env.FORTYTWO_CLIENT_SECRET,
  scope: 'public'
});
const setToken = async function(){
  const clientCredentials = await getClientCredentials();
  const tmp = {...clientCredentials};
  token = tmp.access_token;
  console.log("new token",token);
};
const api42 = {
  getUserData: async function (uriPart) {
    if (token == '')
      await setToken()
    console.log(token);
    useUri = `${END_POINT_42_API}/v2/${uriPart}`;
    const response = await axios.all([axios42(token).get(useUri).catch(async function (error){
      console.log("reserror", error.response.status);
      if (error.response.status == 401)
        await setToken();
    })]);
    ret = { ...response[0].data };
    return ret;
  }
};

module.exports = api42;