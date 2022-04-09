module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    txid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'receive',
        'send',
      ],
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    feeAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    confirmations: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    phase: {
      type: DataTypes.ENUM,
      values: [
        'review',
        'pending',
        'confirming',
        'confirmed',
        'rejected',
        'failed',
      ],
    },
    to_from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    memo: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const TransactionModel = sequelize.define('transaction', modelDefinition, modelOptions);

  TransactionModel.associate = (model) => {
    TransactionModel.hasMany(model.activity, { as: 'transaction' });
    TransactionModel.belongsTo(model.address, { as: 'address' });
    TransactionModel.belongsTo(model.block, { as: 'block' });
    TransactionModel.belongsTo(model.addressExternal, { as: 'addressExternal' });
    TransactionModel.belongsTo(model.user);
  };

  return TransactionModel;
};
