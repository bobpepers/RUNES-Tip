module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'group', // name of Target model
      'banMessage', // name of the key we're adding
      {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('group', 'banMessage');
  },
};
