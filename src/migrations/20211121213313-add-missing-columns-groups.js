module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'group', // name of Target model
      'banned', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('group', 'banned');
  },
};
