'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('domain', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false
      },
      banned: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      views: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      reputation: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 50
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
    await queryInterface.dropTable('domain');
  }
};