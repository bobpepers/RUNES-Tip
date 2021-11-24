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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userTippedId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var TipModel = sequelize.define('tip', modelDefinition, modelOptions); // 4: Wallet belongs to User

  TipModel.associate = function (model) {
    TipModel.belongsTo(model.user, {
      as: 'userTip',
      foreignKey: 'userId'
    });
    TipModel.belongsTo(model.user, {
      as: 'userTipped',
      foreignKey: 'userTippedId'
    });
    TipModel.hasMany(model.activity, {
      as: 'tip'
    });
  }; // 5: Wallet has many addresses


  return TipModel;
};