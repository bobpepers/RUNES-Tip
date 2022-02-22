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
    groupId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    banMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var GroupModel = sequelize.define('group', modelDefinition, modelOptions);

  GroupModel.associate = function (model) {
    GroupModel.hasMany(model.active);
    GroupModel.hasMany(model.channel); // spend

    GroupModel.hasMany(model.reactdrop);
    GroupModel.hasMany(model.flood);
    GroupModel.hasMany(model.rain);
    GroupModel.hasMany(model.soak);
    GroupModel.hasMany(model.sleet);
    GroupModel.hasMany(model.thunder);
    GroupModel.hasMany(model.thunderstorm);
    GroupModel.hasMany(model.hurricane);
    GroupModel.hasMany(model.trivia); // receive

    GroupModel.hasMany(model.reactdroptip);
    GroupModel.hasMany(model.floodtip);
    GroupModel.hasMany(model.raintip);
    GroupModel.hasMany(model.soaktip);
    GroupModel.hasMany(model.sleettip);
    GroupModel.hasMany(model.thundertip);
    GroupModel.hasMany(model.thunderstormtip);
    GroupModel.hasMany(model.hurricanetip);
    GroupModel.hasMany(model.features);
    GroupModel.hasMany(model.triviatip);
  };

  return GroupModel;
};