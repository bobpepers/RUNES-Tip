"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var TriviaQuestionModel = sequelize.define('triviaquestion', modelDefinition, modelOptions);

  TriviaQuestionModel.associate = function (model) {
    // TriviaQuestionModel.belongsTo(model.user);
    TriviaQuestionModel.hasMany(model.trivia);
    TriviaQuestionModel.hasMany(model.triviaanswer);
  };

  return TriviaQuestionModel;
};