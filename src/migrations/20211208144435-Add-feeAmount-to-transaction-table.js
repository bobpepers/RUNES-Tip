module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'transaction', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('transaction', 'feeAmount');
  },
};
