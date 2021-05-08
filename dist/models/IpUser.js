'use strict';

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
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var IpUserModel = sequelize.define('IpUser', modelDefinition, modelOptions);

  IpUserModel.associate = function (model) {
    IpUserModel.belongsTo(model.ip, {
      as: 'ip',
      foreignKey: 'ipId'
    });

    IpUserModel.belongsTo(model.user, {
      as: 'user',
      foreignKey: 'userId'
    });
  };

  return IpUserModel;
};