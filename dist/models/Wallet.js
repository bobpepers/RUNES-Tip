'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    available: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    locked: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    earned: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    spend: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var WalletModel = sequelize.define('wallet', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  WalletModel.associate = function (model) {
    WalletModel.belongsTo(model.user, { as: 'user' });
    WalletModel.hasMany(model.address);
  };

  // 5: Wallet has many addresses

  return WalletModel;
};