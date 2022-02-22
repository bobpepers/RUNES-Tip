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
    TriviaTipModel.belongsTo(model.trivia, {
      as: 'trivia',
      foreignKey: 'triviaId',
    });
    TriviaTipModel.belongsTo(model.triviaanswer);
    TriviaTipModel.hasMany(model.activity, { as: 'triviatip' });
    TriviaTipModel.belongsTo(model.group);
    TriviaTipModel.belongsTo(model.channel);
  };

  // 5: Wallet has many addresses

  return TriviaTipModel;
};
