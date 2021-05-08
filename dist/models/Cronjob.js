'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['drawJackpot']
    },
    state: {
      type: DataTypes.ENUM,
      values: ['executing', 'error', 'finished']
    },
    expression: {
      type: DataTypes.STRING,
      allowNull: true
    }
  };

  var modelOptions = {
    freezeTableName: true
  };

  var CronjobModel = sequelize.define('cronjob', modelDefinition, modelOptions);

  return CronjobModel;
};