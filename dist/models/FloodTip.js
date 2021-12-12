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

  var FloodTipModel = sequelize.define('floodtip', modelDefinition, modelOptions); // 4: Wallet belongs to User

  FloodTipModel.associate = function (model) {
    FloodTipModel.belongsTo(model.user);
    FloodTipModel.belongsTo(model.flood);
    FloodTipModel.hasMany(model.activity, {
      as: 'floodtip'
    });
    FloodTipModel.belongsTo(model.group);
    FloodTipModel.belongsTo(model.channel);
  }; // 5: Wallet has many addresses


  return FloodTipModel;
};