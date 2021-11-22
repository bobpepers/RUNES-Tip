module.exports = (sequelize, DataTypes) => {
  // 1: The model schema.
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channelName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    banMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const ChannelModel = sequelize.define('channel', modelDefinition, modelOptions);

  ChannelModel.associate = (model) => {
    ChannelModel.hasMany(model.reactdrop);
  };

  return ChannelModel;
};
