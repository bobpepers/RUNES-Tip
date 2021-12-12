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
  var ThunderModel = sequelize.define('thunder', modelDefinition, modelOptions);

  ThunderModel.associate = function (model) {
    ThunderModel.belongsTo(model.user);
    ThunderModel.hasMany(model.thundertip);
    ThunderModel.hasMany(model.activity, {
      as: 'thunder'
    });
    ThunderModel.belongsTo(model.group);
    ThunderModel.belongsTo(model.channel);
  };

  return ThunderModel;
};