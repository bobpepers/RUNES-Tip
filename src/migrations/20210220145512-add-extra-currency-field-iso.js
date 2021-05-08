module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'currency', // name of Target model
      'iso', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('currency', 'iso');
  },
};
