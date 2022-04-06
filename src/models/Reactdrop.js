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
    ends: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emoji: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '❤️',
    },
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    side: {
      type: DataTypes.ENUM,
      defaultValue: 'discord',
      allowNull: false,
      values: [
        'discord',
        'matrix',
      ],
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const ReactdropModel = sequelize.define('reactdrop', modelDefinition, modelOptions);

  ReactdropModel.associate = (model) => {
    ReactdropModel.belongsTo(model.user);
    ReactdropModel.hasMany(model.reactdroptip);
    ReactdropModel.belongsTo(model.group);
    ReactdropModel.belongsTo(model.channel);
    ReactdropModel.hasMany(model.activity, { as: 'reactdrop' });
  };

  return ReactdropModel;
};
