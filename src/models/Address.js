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
  const AddressModel = sequelize.define('address', modelDefinition, modelOptions);

  AddressModel.associate = (model) => {
    AddressModel.belongsTo(model.wallet, { as: 'wallet' });
    AddressModel.hasMany(model.transaction, {
      // as: 'transaction',
      // foreignKey: 'txId',
    });
  };

  return AddressModel;
};
