'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('clickOrder', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      filled: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      phase: {
        type: DataTypes.ENUM,
        values: ['active', 'canceled', 'fulfilled'],
        defaultValue: 'active'
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
    await queryInterface.dropTable('clickOrder');
  }
};