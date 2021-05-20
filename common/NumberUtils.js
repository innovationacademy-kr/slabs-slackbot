const ArrayUtils = require('./ArrayUtils');
const NumberUtils = {
  getRandomList: function (max, count) {
    const list = [];
    for (let i = 0; i < max; i++) {
      list.push(i + 1);
    }
    ArrayUtils.shuffle(list);
    return list.slice(0, count);
  },
};

module.exports = NumberUtils;