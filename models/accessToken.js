/**
* @param {import('sequelize').Sequelize} sequelize
* @param {any} DataTypes
*/ 

module.exports = (sequelize, DataTypes) => {
    const AccessToken = sequelize.define('AccessToken', {
      token: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    });
    return AccessToken;
  }