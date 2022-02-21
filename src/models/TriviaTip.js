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
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: [
        'waiting',
        'failed',
        'success',
      ],
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const TriviaTipModel = sequelize.define('triviatip', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  TriviaTipModel.associate = (model) => {
    TriviaTipModel.belongsTo(model.user);
    TriviaTipModel.belongsTo(model.trivia);
    TriviaTipModel.hasMany(model.activity, { as: 'triviatip' });
    TriviaTipModel.belongsTo(model.group);
    TriviaTipModel.belongsTo(model.channel);
  };

  // 5: Wallet has many addresses

  return TriviaTipModel;
};
