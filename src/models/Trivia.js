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
    feeAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ends: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discordMessageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const TriviaModel = sequelize.define('trivia', modelDefinition, modelOptions);

  TriviaModel.associate = (model) => {
    TriviaModel.belongsTo(model.user);
    TriviaModel.hasMany(model.triviatip);
    TriviaModel.hasMany(model.activity, { as: 'trivia' });
    TriviaModel.belongsTo(model.group);
    TriviaModel.belongsTo(model.channel);
  };

  return TriviaModel;
};
