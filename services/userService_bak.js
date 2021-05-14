const axios = require('axios');

// NOTE concept for endpoint
// LINK https://datatracker.ietf.org/doc/html/rfc6749#page-18
const END_POINT_42_API = "https://api.intra.42.fr";
const axios42 = function (accessToken) {
  // make instance for using axios
  const axios42 = axios.create({
    baseURL: END_POINT_42_API,
    'headers': { 'Authorization': 'Bearer ' + accessToken },
    timeout: 2500,
  });
  return axios42;
};

const userService = {
  getUserData: async function (username, accessToken) {
    const userUri = `${END_POINT_42_API}/v2/users/${username}`;
    //const response = await axios.all([axios42(accessToken).get(userUri)]);
    const response = await axios.all([axios42(accessToken).get(userUri)]);
    ret = { ...response[0].data };
    return ret;
  }
};

module.exports = userService;