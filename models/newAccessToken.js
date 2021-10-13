/**
* @param {import('sequelize').Sequelize} sequelize
* @param {any} DataTypes
*/ 

module.exports = (sequelize, DataTypes) => {
    const NewAccessToken = sequelize.define('NewAccessToken', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true
      },
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
    return NewAccessToken;
  }