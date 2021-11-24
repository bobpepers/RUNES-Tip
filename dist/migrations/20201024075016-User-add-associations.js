"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('wallet', 'userId', {
      type: Sequelize.BIGINT,
      references: {
        model: 'user',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: function down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('wallet', 'userId');
  }
};