'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('ip', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      banned: {
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
    // await queryInterface.removeConstraint('activity', 'activity_ipId_foreign_idx');
    await queryInterface.dropTable('ip');
  }
};