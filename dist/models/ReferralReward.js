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
    count: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var RainModel = sequelize.define('referralReward', modelDefinition, modelOptions); // 4: Wallet belongs to User

  RainModel.associate = function (model) {
    RainModel.belongsTo(model.user);
  }; // 5: Wallet has many addresses


  return RainModel;
};