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
  var SoakTipModel = sequelize.define('soaktip', modelDefinition, modelOptions);

  SoakTipModel.associate = function (model) {
    SoakTipModel.belongsTo(model.user);
    SoakTipModel.belongsTo(model.soak);
    SoakTipModel.hasMany(model.activity, {
      as: 'soaktip'
    });
  };

  return SoakTipModel;
};