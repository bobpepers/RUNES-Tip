module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'reactdrop', // name of Target model
      'side', // name of the key we're adding
      {
        type: DataTypes.ENUM,
        defaultValue: 'discord',
        allowNull: false,
        values: [
          'discord',
          'matrix',
        ],
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('reactdrop', 'side');
  },
};
