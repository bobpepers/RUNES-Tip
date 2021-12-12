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
  var ThunderStormTipModel = sequelize.define('thunderstormtip', modelDefinition, modelOptions);

  ThunderStormTipModel.associate = function (model) {
    ThunderStormTipModel.belongsTo(model.user);
    ThunderStormTipModel.belongsTo(model.thunderstorm);
    ThunderStormTipModel.hasMany(model.activity, {
      as: 'thunderstormtip'
    });
    ThunderStormTipModel.belongsTo(model.group);
    ThunderStormTipModel.belongsTo(model.channel);
  };

  return ThunderStormTipModel;
};