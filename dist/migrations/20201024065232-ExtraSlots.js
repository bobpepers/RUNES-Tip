'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('extraSlots', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      purchase: {
        type: DataTypes.ENUM,
        values: ['surf', 'click']
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      available: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      available_next: {
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
    await queryInterface.dropTable('extraSlots');
  }
};