module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'priceInfo', // name of Target model
      'currency', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "USD",
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('priceInfo', 'currency');
  },
};
