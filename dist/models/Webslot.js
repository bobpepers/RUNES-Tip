'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    search: {
      type: DataTypes.STRING,
      allowNull: true
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    banned: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    reputation: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 50
    },
    active: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var WebslotModel = sequelize.define('webslot', modelDefinition, modelOptions);

  WebslotModel.associate = function (model) {
    WebslotModel.belongsTo(model.domain, { as: 'domain' });
    WebslotModel.belongsTo(model.user, { as: 'user' });
    WebslotModel.hasMany(model.order, { as: 'order' });
  };

  return WebslotModel;
};