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
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var RainTipModel = sequelize.define('raintip', modelDefinition, modelOptions); // 4: Wallet belongs to User

  RainTipModel.associate = function (model) {
    RainTipModel.belongsTo(model.user);
    RainTipModel.belongsTo(model.rain);
    RainTipModel.hasMany(model.activity, {
      as: 'raintip'
    });
  }; // 5: Wallet has many addresses


  return RainTipModel;
};