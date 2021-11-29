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
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var FloodModel = sequelize.define('flood', modelDefinition, modelOptions); // 4: Wallet belongs to User

  FloodModel.associate = function (model) {
    FloodModel.belongsTo(model.user);
    FloodModel.hasMany(model.floodtip);
    FloodModel.hasMany(model.activity, {
      as: 'flood'
    });
  }; // 5: Wallet has many addresses


  return FloodModel;
};