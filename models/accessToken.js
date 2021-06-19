/**
* @param {import('sequelize').Sequelize} sequelize
* @param {any} DataTypes
*/ 

module.exports = (sequelize, DataTypes) => {
    const AccessToken = sequelize.define('AccessToken', {
      access_token: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      expires_in: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      }
    });
    return AccessToken;
  }