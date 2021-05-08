module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'autoRain',
      ],
    },
    state: {
      type: DataTypes.ENUM,
      values: [
        'executing',
        'error',
        'finished',
      ],
    },
    expression: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const CronjobModel = sequelize.define('cronjob', modelDefinition, modelOptions);

  return CronjobModel;
};
