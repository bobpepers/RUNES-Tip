module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      nique: false,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const ErrorModel = sequelize.define('error', modelDefinition, modelOptions);

  ErrorModel.associate = (model) => {

  };

  return ErrorModel;
};
