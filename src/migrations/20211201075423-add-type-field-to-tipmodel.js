module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'tip', // name of Target model
      'type', // name of the key we're adding
      {
        type: DataTypes.ENUM,
        values: [
          'each',
          'split',
        ],
        defaultValue: 'split',
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('tip', 'type');
  },
};
