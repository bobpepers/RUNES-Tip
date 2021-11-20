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
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const ThunderStormTipModel = sequelize.define('thunderstormtip', modelDefinition, modelOptions);

  ThunderStormTipModel.associate = (model) => {
    ThunderStormTipModel.belongsTo(model.user);
    ThunderStormTipModel.belongsTo(model.thunderstorm);
    ThunderStormTipModel.hasMany(model.activity, { as: 'thunderstormtip' });
  };

  return ThunderStormTipModel;
};
