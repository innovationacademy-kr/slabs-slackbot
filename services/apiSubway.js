const axios = require('axios');

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
      throw new Error('🚇 정보를 가져오는데 문제가 생겼네요😭');
    });
    
    const { data: { code } } = subwayData;
    if (code === 'INFO-200') {
      throw new Error('🚇 아직 안생긴 역이네요🧐');
    }
    return (subwayData);
  }
};

module.exports = apiSubway;