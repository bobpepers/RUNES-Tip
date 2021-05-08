'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    purchase: {
      type: DataTypes.ENUM,
      values: ['surf', 'click']
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    available: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    available_next: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var ExtraSlotsModel = sequelize.define('extraSlots', modelDefinition, modelOptions);
  return ExtraSlotsModel;
};