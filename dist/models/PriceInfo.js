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
      type: DataTypes.STRING,
      allowNull: false
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var PriceInfoModel = sequelize.define('priceInfo', modelDefinition, modelOptions);
  return PriceInfoModel;
};