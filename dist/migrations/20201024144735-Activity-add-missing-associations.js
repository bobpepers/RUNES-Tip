'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activity', // name of Target model
    'userId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'user', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('activity', 'userId');
  }
};