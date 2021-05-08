'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('faucetRolls', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      serverseed: {
        type: DataTypes.STRING(24),
        allowNull: true,
        defaultValue: 0
      },
      clientseed: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 0
      },
      nonce: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
      },
      rolled: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
      }
    });
    await queryInterface.addColumn('faucetRolls', // name of Target model
    'createdAt', // name of the key we're adding
    {
      allowNull: false,
      type: DataTypes.DATE
    });

    await queryInterface.addColumn('faucetRolls', // name of Target model
    'updatedAt', // name of the key we're adding
    {
      allowNull: false,
      type: DataTypes.DATE
    });
    await queryInterface.addColumn('faucetRolls', // name of Target model
    'faucetId', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      references: {
        model: 'faucet', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activity', // name of Target model
    'faucetRollId', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      references: {
        model: 'faucetRolls', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('faucetRolls', 'createdAt');
    await queryInterface.removeColumn('faucetRolls', 'updatedAt');
    await queryInterface.removeColumn('faucetRolls', 'faucetId');
    await queryInterface.removeColumn('activity', 'faucetRollId');
    await queryInterface.dropTable('faucetRolls');
  }
};