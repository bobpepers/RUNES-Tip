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
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var VoiceRainTipModel = sequelize.define('voiceraintip', modelDefinition, modelOptions); // 4: Wallet belongs to User

  VoiceRainTipModel.associate = function (model) {
    VoiceRainTipModel.belongsTo(model.user);
    VoiceRainTipModel.belongsTo(model.voicerain);
    VoiceRainTipModel.hasMany(model.activity, {
      as: 'voiceraintip'
    });
    VoiceRainTipModel.belongsTo(model.group);
    VoiceRainTipModel.belongsTo(model.channel);
  }; // 5: Wallet has many addresses


  return VoiceRainTipModel;
};