"use strict";

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var ActiveModel = sequelize.define('active', modelDefinition, modelOptions);

  ActiveModel.associate = function (model) {
    ActiveModel.belongsTo(model.group);
    ActiveModel.belongsTo(model.user);
  };

  return ActiveModel;
};