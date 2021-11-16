module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user', // name of Target model
      'ignoreMe', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user', 'ignoreMe');
  },
};
