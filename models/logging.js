'use strict';
module.exports = (sequelize, DataTypes) => {
  const Logging = sequelize.define('Logging', {
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING,
    },
    channel_name: {
      type: DataTypes.STRING,
    },
    command: {
      type: DataTypes.STRING,
    },
    arguments: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true
  });
  return Logging;
}