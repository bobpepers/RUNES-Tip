'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activity', // name of Target model
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
    // await queryInterface.addColumn(
    //  'transaction', // name of Target model
    //  'addressId', // name of the key we're adding
    //  {
    //    type: Sequelize.BIGINT,
    //    references: {
    //      model: 'address', // name of Source model
    //      key: 'id',
    //    },
    //    onUpdate: 'CASCADE',
    //    onDelete: 'SET NULL',
    //  },
    // );
    // await queryInterface.addColumn(
    //  'transaction', // name of Target model
    //  'blockId', // name of the key we're adding
    //  {
    //    type: Sequelize.BIGINT,
    //    references: {
    //      model: 'block', // name of Source model
    //      key: 'id',
    //    },
    //    onUpdate: 'CASCADE',
    //    onDelete: 'SET NULL',
    //  },
    // );
    // await queryInterface.addColumn(
    //  'activity', // name of Target model
    //  'orderId', // name of the key we're adding
    //  {
    //    type: Sequelize.BIGINT,
    //    references: {
    //      model: 'order', // name of Source model
    //      key: 'id',
    //    },
    //    onUpdate: 'CASCADE',
    //    onDelete: 'SET NULL',
    //  },
    // );
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('activity', 'transactionId');
    // await queryInterface.removeColumn('transaction', 'addressId');
    // await queryInterface.removeColumn('transaction', 'blockId');
  }
};