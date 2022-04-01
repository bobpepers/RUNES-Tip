module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'currency', // name of Target model
      'conversionRate', // name of the key we're adding
      {
        type: DataTypes.STRING,
        defaultValue: '1',
        allowNull: true,
      },
    );
    await queryInterface.addColumn(
      'currency', // name of Target model
      'type', // name of the key we're adding
      {
        type: DataTypes.ENUM,
        defaultValue: 'fiat',
        allowNull: false,
        values: [
          'fiat',
          'cryptocurrency',
        ],
      },
    );
    await queryInterface.addColumn(
      'currency', // name of Target model
      'price', // name of the key we're adding
      {
        type: DataTypes.STRING,
        defaultValue: '0',
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('currency', 'conversionRate');
    await queryInterface.removeColumn('currency', 'type');
    await queryInterface.removeColumn('currency', 'price');
  },
};
