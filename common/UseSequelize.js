const findRecord = async function (model, searchCondition) {
  try {
    return (
      model.findOne().then(searchCondition)
    );
  } catch (err) {
    throw new Error("레코드 탐색 오류");
  }
};

const createRecord = async function (model, token) {
  try {
    model.create(
      { token: token }
    )
  } catch (err) {
    throw new Error("(초기) 레코드 생성 오류");
  }
};
  
const updateRecord = async function (model, token) {
  try {
    model.update( {token: token}, {where: { id: '1' }})
  } catch (err) {
      throw new Error("레코드 수정 오류");
  }
};
  
module.exports =  { findRecord, createRecord, updateRecord };