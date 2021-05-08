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
    domainId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var DomainUserModel = sequelize.define('DomainUser', modelDefinition, modelOptions);

  DomainUserModel.associate = function (model) {
    DomainUserModel.belongsTo(model.domain, {
      as: 'domain',
      foreignKey: 'domainId'
    });
    DomainUserModel.belongsTo(model.user, {
      as: 'user',
      foreignKey: 'userId'
    });
  };

  return DomainUserModel;
};