"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var TriviaAnswerModel = sequelize.define('triviaanswer', modelDefinition, modelOptions); // 4: Wallet belongs to User

  TriviaAnswerModel.associate = function (model) {
    TriviaAnswerModel.belongsTo(model.triviaquestion);
    TriviaAnswerModel.hasMany(model.triviatip);
  }; // 5: Wallet has many addresses


  return TriviaAnswerModel;
};