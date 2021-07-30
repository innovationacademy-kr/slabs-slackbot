'use strict';
module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define('Suggestion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    timestamps: true
  });
  return Suggestion;
}