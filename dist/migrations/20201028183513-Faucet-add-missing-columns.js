'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.addColumn('faucet', // name of Target model
    'createdAt', // name of the key we're adding
    {
      allowNull: false,
      type: DataTypes.DATE
    });

    await queryInterface.addColumn('faucet', // name of Target model
    'updatedAt', // name of the key we're adding
    {
      allowNull: false,
      type: DataTypes.DATE
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('faucet', 'createdAt');
    await queryInterface.removeColumn('faucet', 'updatedAt');
  }
};