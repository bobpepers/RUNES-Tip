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
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const RainModel = sequelize.define('rain', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  RainModel.associate = (model) => {
    RainModel.belongsTo(model.user);
    RainModel.hasMany(model.raintip);
  };

  // 5: Wallet has many addresses

  return RainModel;
};
