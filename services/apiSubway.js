require('dotenv').config();
const axios = require('axios');
const oauth = require('axios-oauth-client');

const TOKEN_REQUEST_TIME_OUT = 2500;
const END_POINT_42_API = "http://swopenAPI.seoul.go.kr/api/subway";

const apiSubway = {
  getSubwayData: async function (req, res, uriPart) {
    const reqUri = `${END_POINT_42_API}/${process.env.SUBWAY_CLIENT_SECRET}/${uriPart}`;
    const encodedUri = encodeURI(reqUri);
    console.log("# reqUri: ", reqUri);

    const subwayData = await axios.get(encodedUri)
    .then((response)=>{
      return response;
    }).catch((error)=> {
      throw new Error('π μ λ³΄λ₯Ό κ°μ Έμ€λλ° λ¬Έμ κ° μκ²Όλ€μπ­');
    });
    
    const { data: { code } } = subwayData;
    if (code === 'INFO-200') {
      throw new Error('π μμ§ μμκΈ΄ μ­μ΄λ€μπ§');
    }
    return (subwayData);
  }
};

module.exports = apiSubway;