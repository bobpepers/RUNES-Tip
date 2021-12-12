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
  var TipTipModel = sequelize.define('tiptip', modelDefinition, modelOptions);

  TipTipModel.associate = function (model) {
    TipTipModel.belongsTo(model.user);
    TipTipModel.belongsTo(model.tip);
    TipTipModel.hasMany(model.activity, {
      as: 'tiptip'
    });
    TipTipModel.belongsTo(model.group);
    TipTipModel.belongsTo(model.channel);
  };

  return TipTipModel;
};