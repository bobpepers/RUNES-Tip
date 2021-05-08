'use strict';

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
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
    active: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var BannerslotModel = sequelize.define('bannerslot', modelDefinition, modelOptions);

  BannerslotModel.associate = function (model) {
    BannerslotModel.belongsTo(model.user, { as: 'user' });
    BannerslotModel.hasMany(model.clickOrder, { as: 'clickorder' });
  };

  return BannerslotModel;
};