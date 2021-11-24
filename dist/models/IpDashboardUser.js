"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ipId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Domain model.

  var IpDashboardUserModel = sequelize.define('IpDashboardUser', modelDefinition, modelOptions);

  IpDashboardUserModel.associate = function (model) {
    IpDashboardUserModel.belongsTo(model.ip, {
      as: 'ip',
      foreignKey: 'ipId'
    });
    IpDashboardUserModel.belongsTo(model.dashboardUser, {
      as: 'dashboardUser',
      foreignKey: 'dashboardUserId'
    });
  };

  return IpDashboardUserModel;
};