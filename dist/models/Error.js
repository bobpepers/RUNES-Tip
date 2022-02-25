"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      nique: false
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var ErrorModel = sequelize.define('error', modelDefinition, modelOptions);

  ErrorModel.associate = function (model) {};

  return ErrorModel;
};