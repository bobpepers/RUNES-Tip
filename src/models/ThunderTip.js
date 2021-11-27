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

  const ThunderTipModel = sequelize.define('thundertip', modelDefinition, modelOptions);

  ThunderTipModel.associate = (model) => {
    ThunderTipModel.belongsTo(model.user);
    ThunderTipModel.belongsTo(model.thunder);
    ThunderTipModel.hasMany(model.activity, { as: 'thundertip' });
    ThunderTipModel.belongsTo(model.group);
    ThunderTipModel.belongsTo(model.channel);
  };

  return ThunderTipModel;
};
