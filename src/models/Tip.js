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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userTippedId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const TipModel = sequelize.define('tip', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  TipModel.associate = (model) => {
    TipModel.belongsTo(model.user, {
      as: 'userTip',
      foreignKey: 'userId',
    });
    TipModel.belongsTo(model.user, {
      as: 'userTipped',
      foreignKey: 'userTippedId',
    });
  };

  // 5: Wallet has many addresses

  return TipModel;
};
