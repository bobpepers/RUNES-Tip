module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const FaucetTipModel = sequelize.define('faucettip', modelDefinition, modelOptions);

  FaucetTipModel.associate = (model) => {
    FaucetTipModel.belongsTo(model.user);
    FaucetTipModel.belongsTo(model.faucet);
    FaucetTipModel.hasMany(model.activity, { as: 'faucettip' });
  };

  return FaucetTipModel;
};
