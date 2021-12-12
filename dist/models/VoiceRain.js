"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    feeAmount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var VoiceRainModel = sequelize.define('voicerain', modelDefinition, modelOptions); // 4: Wallet belongs to User

  VoiceRainModel.associate = function (model) {
    VoiceRainModel.belongsTo(model.user);
    VoiceRainModel.belongsTo(model.group);
    VoiceRainModel.belongsTo(model.channel);
    VoiceRainModel.hasMany(model.voiceraintip);
    VoiceRainModel.hasMany(model.activity, {
      as: 'voicerain'
    });
  }; // 5: Wallet has many addresses


  return VoiceRainModel;
};