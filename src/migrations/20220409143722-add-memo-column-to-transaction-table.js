module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'transaction', // name of Target model
      'memo', // name of the key we're adding
      {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('transaction', 'memo');
  },
};
