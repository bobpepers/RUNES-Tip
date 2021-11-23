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

  const HurricaneModel = sequelize.define('hurricane', modelDefinition, modelOptions);

  HurricaneModel.associate = (model) => {
    HurricaneModel.belongsTo(model.user);
    HurricaneModel.hasMany(model.hurricanetip);
    HurricaneModel.hasMany(model.activity, {
      as: 'hurricane',
    });
  };

  return HurricaneModel;
};
