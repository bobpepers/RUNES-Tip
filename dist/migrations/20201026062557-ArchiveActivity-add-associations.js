'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activityArchive', // name of Target model
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
    await queryInterface.addColumn('activityArchive', // name of Source model
    'ipId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'ip', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activityArchive', // name of Source model
    'orderId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'order', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activityArchive', // name of Source model
    'domainId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'domain', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activityArchive', // name of Source model
    'txId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'transaction', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activityArchive', 'spenderId', {
      type: Sequelize.BIGINT,
      references: {
        model: 'user',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activityArchive', 'earnerId', {
      type: Sequelize.BIGINT,
      references: {
        model: 'user',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('activityArchive', // name of Target model
    'transactionId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'transaction', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('activityArchive', 'userId');
    await queryInterface.removeColumn('activityArchive', 'ipId');
    await queryInterface.removeColumn('activityArchive', 'orderId');
    await queryInterface.removeColumn('activityArchive', 'domainId');
    await queryInterface.removeColumn('activityArchive', 'txId');
    await queryInterface.removeColumn('activityArchive', 'spenderId');
    await queryInterface.removeColumn('activityArchive', 'earnerId');
    await queryInterface.removeColumn('activityArchive', 'transactionId');
  }
};

//