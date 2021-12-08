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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userTippedId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    userCount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1,
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'each',
        'split',
      ],
      defaultValue: 'split',
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const TipModel = sequelize.define('tip', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  TipModel.associate = (model) => {
    TipModel.belongsTo(model.user);
    TipModel.hasMany(model.activity, { as: 'tip' });
    TipModel.belongsTo(model.group);
    TipModel.belongsTo(model.channel);
  };

  // 5: Wallet has many addresses

  return TipModel;
};
