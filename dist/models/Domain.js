'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banned: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    reputation: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 50
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var DomainModel = sequelize.define('domain', modelDefinition, modelOptions);

  DomainModel.associate = function (model) {
    DomainModel.hasMany(model.webslot, { as: 'webslot' });
    DomainModel.hasMany(model.activity, { as: 'domainActivity' });
    DomainModel.belongsToMany(model.user, {
      through: 'DomainUser',
      as: 'users',
      foreignKey: 'domainId',
      otherKey: 'userId'
    });
  };

  return DomainModel;
};