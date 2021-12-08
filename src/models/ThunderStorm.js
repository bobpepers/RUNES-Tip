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
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const ThunderStormModel = sequelize.define('thunderstorm', modelDefinition, modelOptions);

  ThunderStormModel.associate = (model) => {
    ThunderStormModel.belongsTo(model.user);
    ThunderStormModel.hasMany(model.thunderstormtip);
    ThunderStormModel.hasMany(model.activity, { as: 'thunderstorm' });
    ThunderStormModel.belongsTo(model.group);
    ThunderStormModel.belongsTo(model.channel);
  };

  return ThunderStormModel;
};
