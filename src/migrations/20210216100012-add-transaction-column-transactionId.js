module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'transaction', // name of Target model
      'transactionId', // name of the key we're adding
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('transaction', 'transactionId');
  },
};
