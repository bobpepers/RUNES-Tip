module.exports = (sequelize, DataTypes) => {
  // 1: The model schema.
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const ActiveModel = sequelize.define('active', modelDefinition, modelOptions);

  ActiveModel.associate = (model) => {
    ActiveModel.belongsTo(model.group);
    ActiveModel.belongsTo(model.user);
  };

  return ActiveModel;
};
