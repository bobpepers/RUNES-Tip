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
    channelId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    channelName: {
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

  var ChannelModel = sequelize.define('channel', modelDefinition, modelOptions);

  ChannelModel.associate = function (model) {
    ChannelModel.hasMany(model.reactdrop);
    ChannelModel.belongsTo(model.group);
  };

  return ChannelModel;
};