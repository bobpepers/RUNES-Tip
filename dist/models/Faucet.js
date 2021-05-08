'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    earned: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var FaucetModel = sequelize.define('faucet', modelDefinition, modelOptions);

  FaucetModel.associate = function (model) {
    FaucetModel.hasMany(model.faucetRolls, { as: 'faucetRolls' });
  };

  return FaucetModel;
};