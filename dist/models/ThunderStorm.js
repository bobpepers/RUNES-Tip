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
  };
  var modelOptions = {
    freezeTableName: true
  };
  var ThunderStormModel = sequelize.define('thunderstorm', modelDefinition, modelOptions);

  ThunderStormModel.associate = function (model) {
    ThunderStormModel.belongsTo(model.user);
    ThunderStormModel.hasMany(model.thunderstormtip);
    ThunderStormModel.hasMany(model.activity, {
      as: 'thunderstorm'
    });
    ThunderStormModel.belongsTo(model.group);
    ThunderStormModel.belongsTo(model.channel);
  };

  return ThunderStormModel;
};