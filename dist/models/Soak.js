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
  var SoakModel = sequelize.define('soak', modelDefinition, modelOptions);

  SoakModel.associate = function (model) {
    SoakModel.belongsTo(model.user);
    SoakModel.hasMany(model.soaktip);
    SoakModel.hasMany(model.activity, {
      as: 'soak'
    });
    SoakModel.belongsTo(model.group);
    SoakModel.belongsTo(model.channel);
  };

  return SoakModel;
};