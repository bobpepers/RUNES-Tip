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
    ChannelModel.belongsTo(model.group);
    ChannelModel.hasMany(model.features);

    // spend
    ChannelModel.hasMany(model.reactdrop);
    ChannelModel.hasMany(model.flood);
    ChannelModel.hasMany(model.rain);
    ChannelModel.hasMany(model.soak);
    ChannelModel.hasMany(model.sleet);
    ChannelModel.hasMany(model.thunder);
    ChannelModel.hasMany(model.thunderstorm);
    ChannelModel.hasMany(model.hurricane);
    ChannelModel.hasMany(model.trivia);

    // receive
    ChannelModel.hasMany(model.reactdroptip);
    ChannelModel.hasMany(model.floodtip);
    ChannelModel.hasMany(model.raintip);
    ChannelModel.hasMany(model.soaktip);
    ChannelModel.hasMany(model.sleettip);
    ChannelModel.hasMany(model.thundertip);
    ChannelModel.hasMany(model.thunderstormtip);
    ChannelModel.hasMany(model.hurricanetip);
    ChannelModel.hasMany(model.triviatip);
  };

  return ChannelModel;
};
