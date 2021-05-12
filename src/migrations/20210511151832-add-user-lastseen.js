module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user', // name of Target model
      'lastSeen', // name of the key we're adding
      {
        type: DataTypes.DATE,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user', 'lastSeen');
  },
};
