module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'features', // name of Target model
      'min', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1000000,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('features', 'min');
  },
};
