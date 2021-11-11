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
    discordMessageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const ReactdropModel = sequelize.define('reactdrop', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  ReactdropModel.associate = (model) => {
    ReactdropModel.belongsTo(model.user);
    ReactdropModel.hasMany(model.reactdroptip);
    ReactdropModel.belongsTo(model.group);
  };

  // 5: Wallet has many addresses

  return ReactdropModel;
};
