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
  };
  var modelOptions = {
    freezeTableName: true
  };
  var HurricaneModel = sequelize.define('hurricane', modelDefinition, modelOptions);

  HurricaneModel.associate = function (model) {
    HurricaneModel.belongsTo(model.user);
    HurricaneModel.hasMany(model.hurricanetip);
    HurricaneModel.hasMany(model.activity, {
      as: 'hurricane'
    });
  };

  return HurricaneModel;
};