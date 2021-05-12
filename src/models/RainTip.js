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
  const RainTipModel = sequelize.define('raintip', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  RainTipModel.associate = (model) => {
    RainTipModel.belongsTo(model.user);
    RainTipModel.belongsTo(model.rain);
  };

  // 5: Wallet has many addresses

  return RainTipModel;
};
