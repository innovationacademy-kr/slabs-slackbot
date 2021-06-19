const findRecord = async function (model, searchCondition) {
  try {
    return (
      model.findOne().then(searchCondition)
    );
  } catch (err) {
    throw new Error("레코드 탐색 오류");
  }
};

const createRecord = async function (model, data) {
  try {
    model.create(
      { 
        access_token: data.accessToken,
        expires_in: data.expireTime
      }
    )
  } catch (err) {
    throw new Error("(초기) 레코드 생성 오류");
  }
};
  
const updateRecord = async function (model, data) {
  try {
    model.update(
      {
        access_token: data.accessToken,
        expires_in: data.expireTime
      }, 
      {
        where: { id: '1' }
      })
  } catch (err) {
      throw new Error("레코드 수정 오류");
  }
};
  
module.exports =  { findRecord, createRecord, updateRecord };