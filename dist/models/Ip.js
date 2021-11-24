"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banned: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Domain model.

  var IpModel = sequelize.define('ip', modelDefinition, modelOptions);

  IpModel.associate = function (model) {
    IpModel.belongsToMany(model.user, {
      through: 'IpDashboardUser',
      as: 'dashboardUsers',
      foreignKey: 'ipId',
      otherKey: 'dashboardUserId'
    });
  };

  return IpModel;
};