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
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['waiting', 'failed', 'success']
    },
    captchaType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    solution: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var ReactdropTipModel = sequelize.define('reactdroptip', modelDefinition, modelOptions); // 4: Wallet belongs to User

  ReactdropTipModel.associate = function (model) {
    ReactdropTipModel.belongsTo(model.user);
    ReactdropTipModel.belongsTo(model.reactdrop);
    ReactdropTipModel.hasMany(model.activity, {
      as: 'reactdroptip'
    });
  }; // 5: Wallet has many addresses


  return ReactdropTipModel;
};