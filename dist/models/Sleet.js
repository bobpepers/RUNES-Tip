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
    feeAmount: {
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

  var SleetModel = sequelize.define('sleet', modelDefinition, modelOptions); // 4: Wallet belongs to User

  SleetModel.associate = function (model) {
    SleetModel.belongsTo(model.user);
    SleetModel.hasMany(model.sleettip);
    SleetModel.hasMany(model.activity, {
      as: 'sleet'
    });
    SleetModel.belongsTo(model.group);
    SleetModel.belongsTo(model.channel);
  }; // 5: Wallet has many addresses


  return SleetModel;
};