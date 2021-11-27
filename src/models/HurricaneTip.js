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

  const HurricaneTipModel = sequelize.define('hurricanetip', modelDefinition, modelOptions);

  HurricaneTipModel.associate = (model) => {
    HurricaneTipModel.belongsTo(model.user);
    HurricaneTipModel.belongsTo(model.hurricane);
    HurricaneTipModel.hasMany(model.activity, { as: 'hurricanetip' });
    HurricaneTipModel.belongsTo(model.group);
    HurricaneTipModel.belongsTo(model.channel);
  };

  return HurricaneTipModel;
};
