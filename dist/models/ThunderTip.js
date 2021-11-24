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
  var ThunderTipModel = sequelize.define('thundertip', modelDefinition, modelOptions);

  ThunderTipModel.associate = function (model) {
    ThunderTipModel.belongsTo(model.user);
    ThunderTipModel.belongsTo(model.thunder);
    ThunderTipModel.hasMany(model.activity, {
      as: 'thundertip'
    });
  };

  return ThunderTipModel;
};