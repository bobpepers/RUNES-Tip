module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('transaction', {
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
        ],
      },
      to_from: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('transaction');
  },
};
