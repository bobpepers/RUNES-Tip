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
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const ThunderModel = sequelize.define('thunder', modelDefinition, modelOptions);

  ThunderModel.associate = (model) => {
    ThunderModel.belongsTo(model.user);
    ThunderModel.hasMany(model.thundertip);
    ThunderModel.hasMany(model.activity, { as: 'thunder' });
  };

  return ThunderModel;
};
