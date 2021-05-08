'use strict';

// The Stats model.

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    click: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    surf: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    jackpot: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Stats model.
  var StatsModel = sequelize.define('stats', modelDefinition, modelOptions);
  return StatsModel;
};