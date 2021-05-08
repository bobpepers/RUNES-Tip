'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order', // name of Target model
    'webslotId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'webslot', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('SurfTicket', // name of Target model
    'orderId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'order', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
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
    await queryInterface.removeColumn('order', 'webslotId');
    await queryInterface.removeColumn('SurfTicket', 'orderId');
    // await queryInterface.removeColumn('activity', 'orderId');
  }
};