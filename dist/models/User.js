"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    ignoreMe: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    banMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    referral_count: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var UserModel = sequelize.define('user', modelDefinition, modelOptions);

  UserModel.associate = function (model) {
    UserModel.hasOne(model.wallet);
    UserModel.hasMany(model.tip, {
      foreignKey: 'userId',
      as: 'userTip'
    });
    UserModel.hasMany(model.tip, {
      foreignKey: 'userTippedId',
      as: 'userTipped'
    });
    UserModel.hasMany(model.rain);
    UserModel.hasMany(model.raintip);
    UserModel.hasMany(model.referral);
    UserModel.hasMany(model.referralReward);
    UserModel.hasMany(model.active, {
      foreignKey: 'userId',
      as: 'active'
    });
    UserModel.hasMany(model.reactdrop);
    UserModel.hasMany(model.faucettip);
  };

  return UserModel;
};