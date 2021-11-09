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

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const FloodTipModel = sequelize.define('floodtip', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  FloodTipModel.associate = (model) => {
    FloodTipModel.belongsTo(model.user);
    FloodTipModel.belongsTo(model.flood);
  };

  // 5: Wallet has many addresses

  return FloodTipModel;
};
