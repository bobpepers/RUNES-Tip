module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const TriviaQuestionModel = sequelize.define('triviaquestion', modelDefinition, modelOptions);

  TriviaQuestionModel.associate = (model) => {
    // TriviaQuestionModel.belongsTo(model.user);
    TriviaQuestionModel.hasMany(model.trivia);
    TriviaQuestionModel.hasMany(model.triviaanswer);
  };

  return TriviaQuestionModel;
};
