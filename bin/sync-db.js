const models = require('../models');

module.exports = () => {
    return models.sequelize.sync({force: true}); //기존에 db가 있어라도 새로만들기
    // 리턴값이 promise를 리턴해서 비동기 처리를 완료하도록 인터페이스를 제공함
}