module.exports = (sequelize, DataTypes) => {
// 1: The model schema.
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    blockTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const BlockModel = sequelize.define('block', modelDefinition, modelOptions);

  BlockModel.associate = (model) => {
    BlockModel.hasMany(model.transaction);
  };

  return BlockModel;
};
