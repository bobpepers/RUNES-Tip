'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    filled: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    phase: {
      type: DataTypes.ENUM,
      values: ['active', 'canceled', 'fulfilled'],
      defaultValue: 'active'
    }
  };

  var modelOptions = {
    freezeTableName: true
  };

  var ClickOrderModel = sequelize.define('clickOrder', modelDefinition, modelOptions);

  ClickOrderModel.associate = function (model) {
    ClickOrderModel.belongsTo(model.bannerslot, { as: 'bannerslot' });
  };

  return ClickOrderModel;
};