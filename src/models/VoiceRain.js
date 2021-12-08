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

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const VoiceRainModel = sequelize.define('voicerain', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  VoiceRainModel.associate = (model) => {
    VoiceRainModel.belongsTo(model.user);
    VoiceRainModel.belongsTo(model.group);
    VoiceRainModel.belongsTo(model.channel);
    VoiceRainModel.hasMany(model.voiceraintip);
    VoiceRainModel.hasMany(model.activity, {
      as: 'voicerain',
    });
  };

  // 5: Wallet has many addresses

  return VoiceRainModel;
};
