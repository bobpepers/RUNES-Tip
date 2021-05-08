'use strict';

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    blockTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var BlockModel = sequelize.define('block', modelDefinition, modelOptions);

  BlockModel.associate = function (model) {
    BlockModel.hasMany(model.transaction);
  };

  return BlockModel;
};