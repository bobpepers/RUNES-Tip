"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var AddressExternalModel = sequelize.define('addressExternal', modelDefinition, modelOptions);

  AddressExternalModel.associate = function (model) {
    AddressExternalModel.hasMany(model.transaction);
    AddressExternalModel.belongsToMany(model.user, {
      through: 'UserAddressExternal'
    });
  };

  return AddressExternalModel;
};