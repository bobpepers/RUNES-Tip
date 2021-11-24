"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var FaucetTipModel = sequelize.define('faucettip', modelDefinition, modelOptions);

  FaucetTipModel.associate = function (model) {
    FaucetTipModel.belongsTo(model.user);
    FaucetTipModel.belongsTo(model.faucet);
    FaucetTipModel.hasMany(model.activity, {
      as: 'faucettip'
    });
  };

  return FaucetTipModel;
};