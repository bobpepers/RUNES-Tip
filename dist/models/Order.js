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

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var OrderModel = sequelize.define('order', modelDefinition, modelOptions);

  OrderModel.associate = function (model) {
    OrderModel.belongsTo(model.webslot, { as: 'webslot' });
    OrderModel.hasMany(model.SurfTicket, { as: 'surfTicket' });
    OrderModel.hasMany(model.activity, { as: 'order' });
  };

  return OrderModel;
};