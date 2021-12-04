module.exports = (sequelize, DataTypes) => {
  // 1: The model schema.
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
        'global',
        'local',
      ],
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const FeaturesModel = sequelize.define('features', modelDefinition, modelOptions);

  FeaturesModel.associate = (model) => {
    FeaturesModel.belongsTo(model.group);
    FeaturesModel.hasMany(model.channel);
  };

  return FeaturesModel;
};
