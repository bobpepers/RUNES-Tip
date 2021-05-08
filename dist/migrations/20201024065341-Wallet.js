'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('wallet', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      available: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      locked: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      earned: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      spend: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.dropTable('wallet');
  }
};