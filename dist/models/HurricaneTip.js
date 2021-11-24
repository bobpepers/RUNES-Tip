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
  var HurricaneTipModel = sequelize.define('hurricanetip', modelDefinition, modelOptions);

  HurricaneTipModel.associate = function (model) {
    HurricaneTipModel.belongsTo(model.user);
    HurricaneTipModel.belongsTo(model.hurricane);
    HurricaneTipModel.hasMany(model.activity, {
      as: 'hurricanetip'
    });
  };

  return HurricaneTipModel;
};