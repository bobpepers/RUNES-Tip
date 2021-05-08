'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('webslot', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      protocol: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subdomain: {
        type: DataTypes.STRING,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      search: {
        type: DataTypes.STRING,
        allowNull: true
      },
      views: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      banned: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
      },
      reputation: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 50
      },
      active: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('webslot');
  }
};