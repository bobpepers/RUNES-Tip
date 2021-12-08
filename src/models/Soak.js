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

  const SoakModel = sequelize.define('soak', modelDefinition, modelOptions);

  SoakModel.associate = (model) => {
    SoakModel.belongsTo(model.user);
    SoakModel.hasMany(model.soaktip);
    SoakModel.hasMany(model.activity, { as: 'soak' });
    SoakModel.belongsTo(model.group);
    SoakModel.belongsTo(model.channel);
  };

  return SoakModel;
};
