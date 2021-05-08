module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    blockedId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const BlockedModel = sequelize.define('blocked', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  BlockedModel.associate = (model) => {
    BlockedModel.belongsTo(model.user, {
      as: 'userBlock',
      foreignKey: 'userId',
    });
    BlockedModel.belongsTo(model.user, {
      as: 'userBlocked',
      foreignKey: 'blockedId',
    });
  };

  // 5: Wallet has many addresses

  return BlockedModel;
};
