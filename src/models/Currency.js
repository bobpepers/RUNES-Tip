module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    currency_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iso: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conversionRate: {
      type: DataTypes.STRING,
      defaultValue: '1',
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      defaultValue: 'fiat',
      allowNull: false,
      values: [
        'fiat',
        'cryptocurrency',
      ],
    },
    price: {
      type: DataTypes.STRING,
      defaultValue: '0',
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const CurrencyModel = sequelize.define('currency', modelDefinition, modelOptions);

  CurrencyModel.associate = (model) => {

  };

  return CurrencyModel;
};
