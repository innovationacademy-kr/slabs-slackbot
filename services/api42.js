require('dotenv').config();
const axios = require('axios');
const oauth = require('axios-oauth-client');

const TOKEN_REQUEST_TIME_OUT = 2500;
const END_POINT_42_API = "https://api.intra.42.fr";

const getToken = async function(){
  const clientCredentials = await getClientCredentials();
  const tmp = { ...clientCredentials };
  const token = tmp.access_token;
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
  getUserData: async function (res, uriPart) {
    useUri = `${END_POINT_42_API}/v2/${uriPart}`;
    const token = await getToken();
    try {
      const response = await axios.all([axios42(token).get(useUri)]);
      ret = { ...response[0].data };
      return ret;
    } catch (error) {
      if (error.response) {
        //console.log(error.response.data);
        console.log("# axios42 error status: ", error.response.status);
        // console.log(error.response.headers);
      }
    }
  }
};

module.exports = api42;