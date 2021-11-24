"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var ReferralModel = sequelize.define('referral', modelDefinition, modelOptions); // 4: Wallet belongs to User

  ReferralModel.associate = function (model) {
    ReferralModel.belongsTo(model.user);
  }; // 5: Wallet has many addresses


  return ReferralModel;
};