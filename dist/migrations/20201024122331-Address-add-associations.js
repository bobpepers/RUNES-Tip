'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('address', // name of Source model
    'walletId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'wallet', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }).then(function () {
      return queryInterface.addColumn('transaction', // name of Target model
      'addressId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'address', // name of Source model
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    });
  },

  down: function down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('address', 'walletId').then(function () {
      return queryInterface.removeColumn('transaction', 'addressId');
    });
  }

};