module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const AddressExternalModel = sequelize.define('addressExternal', modelDefinition, modelOptions);

  AddressExternalModel.associate = (model) => {
    AddressExternalModel.hasMany(model.transaction);
    AddressExternalModel.belongsToMany(
      model.user,
      { through: 'UserAddressExternal' },
    );
  };

  return AddressExternalModel;
};
