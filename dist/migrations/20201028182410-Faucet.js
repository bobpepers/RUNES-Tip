'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('faucet', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      earned: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    });
    await queryInterface.addColumn('faucet', // name of Target model
    'userId', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      references: {
        model: 'user', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('faucet', 'userId');
    await queryInterface.dropTable('faucet');
  }
};