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

  var SleetTipModel = sequelize.define('sleettip', modelDefinition, modelOptions); // 4: Wallet belongs to User

  SleetTipModel.associate = function (model) {
    SleetTipModel.belongsTo(model.user);
    SleetTipModel.belongsTo(model.sleet);
    SleetTipModel.hasMany(model.activity, {
      as: 'sleettip'
    });
    SleetTipModel.belongsTo(model.group);
    SleetTipModel.belongsTo(model.channel);
  }; // 5: Wallet has many addresses


  return SleetTipModel;
};