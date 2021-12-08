module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'features', // name of Target model
      'fee', // name of the key we're adding
      {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('features', 'fee');
  },
};
