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
  const SleetModel = sequelize.define('sleet', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  SleetModel.associate = (model) => {
    SleetModel.belongsTo(model.user);
    SleetModel.hasMany(model.sleettip);
    SleetModel.hasMany(model.activity, { as: 'sleet' });
    SleetModel.belongsTo(model.group);
    SleetModel.belongsTo(model.channel);
  };

  // 5: Wallet has many addresses

  return SleetModel;
};
