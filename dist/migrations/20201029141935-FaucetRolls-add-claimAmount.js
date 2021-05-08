'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.addColumn('faucetRolls', // name of Target model
    'claimAmount', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('faucetRolls', 'claimAmount');
  }
};