"use strict";

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['global', 'local']
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    min: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1000000
    },
    fee: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var FeaturesModel = sequelize.define('features', modelDefinition, modelOptions);

  FeaturesModel.associate = function (model) {
    FeaturesModel.belongsTo(model.dashboardUser);
    FeaturesModel.belongsTo(model.group);
    FeaturesModel.belongsTo(model.channel);
  };

  return FeaturesModel;
};