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

  const SoakTipModel = sequelize.define('soaktip', modelDefinition, modelOptions);

  SoakTipModel.associate = (model) => {
    SoakTipModel.belongsTo(model.user);
    SoakTipModel.belongsTo(model.soak);
    SoakTipModel.hasMany(model.activity, { as: 'soaktip' });
  };

  return SoakTipModel;
};
