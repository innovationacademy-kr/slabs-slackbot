const createModel = async function (model, token) {
    try {
      model.create(
        { token: token }
      )
    } catch (err) {
      throw new Error("(초기) 레코드 생성 오류");
    }
  };
  
const updateModel = async function (model, token) {
  try {
    model.update( {token: token}, {where: { id: '1' }})
  } catch (err) {
      throw new Error("테이블 수정 오류");
  }
};
  
exports.moduel =  {createModel, updateModel};