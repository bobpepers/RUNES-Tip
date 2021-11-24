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
    },
    totalAmountClaimed: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    claims: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var FaucetModel = sequelize.define('faucet', modelDefinition, modelOptions); // 4: Wallet belongs to User

  FaucetModel.associate = function (model) {
    FaucetModel.hasMany(model.faucettip);
  }; // 5: Wallet has many addresses


  return FaucetModel;
};