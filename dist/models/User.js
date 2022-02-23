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
    publicStats: {
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
    UserModel.hasMany(model.referral);
    UserModel.hasMany(model.referralReward);
    UserModel.hasMany(model.active, {
      foreignKey: 'userId',
      as: 'active'
    });
    UserModel.belongsToMany(model.addressExternal, {
      through: 'UserAddressExternal'
    });
    UserModel.hasMany(model.tip);
    UserModel.hasMany(model.rain);
    UserModel.hasMany(model.reactdrop);
    UserModel.hasMany(model.trivia, {
      as: 'trivias'
    });
    UserModel.hasMany(model.faucettip);
    UserModel.hasMany(model.flood);
    UserModel.hasMany(model.soak);
    UserModel.hasMany(model.flood);
    UserModel.hasMany(model.sleet);
    UserModel.hasMany(model.thunder, {
      as: 'thunders'
    });
    UserModel.hasMany(model.thunderstorm);
    UserModel.hasMany(model.hurricane);
    UserModel.hasMany(model.reactdroptip);
    UserModel.hasMany(model.triviatip, {
      as: 'triviatips'
    });
    UserModel.hasMany(model.raintip);
    UserModel.hasMany(model.floodtip);
    UserModel.hasMany(model.soaktip);
    UserModel.hasMany(model.floodtip);
    UserModel.hasMany(model.sleettip);
    UserModel.hasMany(model.thundertip);
    UserModel.hasMany(model.thunderstormtip);
    UserModel.hasMany(model.hurricanetip);
    UserModel.hasMany(model.tiptip);
  };

  return UserModel;
};