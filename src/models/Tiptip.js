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

  const TipTipModel = sequelize.define('tiptip', modelDefinition, modelOptions);

  TipTipModel.associate = (model) => {
    TipTipModel.belongsTo(model.user);
    TipTipModel.belongsTo(model.tip);
    TipTipModel.hasMany(model.activity, { as: 'tiptip' });
    TipTipModel.belongsTo(model.group);
    TipTipModel.belongsTo(model.channel);
  };

  return TipTipModel;
};
