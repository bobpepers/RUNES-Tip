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
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const CurrencyModel = sequelize.define('currency', modelDefinition, modelOptions);

  CurrencyModel.associate = (model) => {
    CurrencyModel.hasMany(model.postAd, {
      as: 'postAd',
    });
    CurrencyModel.hasMany(model.country, {
      as: 'country',
    });
  };

  return CurrencyModel;
};
