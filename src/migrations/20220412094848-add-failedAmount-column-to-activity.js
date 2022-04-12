module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'activity', // name of Target model
      'failedAmount', // name of the key we're adding
      {
        type: DataTypes.STRING(4000),
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'failedAmount');
  },
};
