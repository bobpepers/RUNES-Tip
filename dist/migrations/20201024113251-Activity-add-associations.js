'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('activity', // name of Source model
    'ipId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'ip', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    // .then(() => queryInterface.addColumn(
    //  'activity', // name of Source model
    //  'spenderId', // name of the key we're adding
    //  {
    //    type: Sequelize.BIGINT,
    //    references: {
    //      model: 'user', // name of Target model
    //      key: 'id', // key in Target model that we're referencing
    //    },
    //    onUpdate: 'CASCADE',
    //    onDelete: 'SET NULL',
    //  },
    // ))
    // .then(() => queryInterface.addColumn(
    //  'activity', // name of Source model
    //  'earnerId', // name of the key we're adding
    //  {
    //    type: Sequelize.BIGINT,
    //    references: {
    //      model: 'user', // name of Target model
    //      key: 'id', // key in Target model that we're referencing
    //    },
    //    onUpdate: 'CASCADE',
    //    onDelete: 'SET NULL',
    //  },
    // ))
    .then(function () {
      return queryInterface.addColumn('activity', // name of Source model
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
    }).then(function () {
      return queryInterface.addColumn('activity', // name of Source model
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
    }).then(function () {
      return queryInterface.addColumn('activity', // name of Source model
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
    });
  },

  down: function down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('activity', 'ipId')
    // .then(() => queryInterface.removeColumn(
    //  'activity',
    //  'spenderId',
    // ))
    // .then(() => queryInterface.removeColumn(
    //  'activity',
    //  'earnerId',
    // ))
    .then(function () {
      return queryInterface.removeColumn('activity', 'orderId');
    }).then(function () {
      return queryInterface.removeColumn('activity', 'domainId');
    }).then(function () {
      return queryInterface.removeColumn('activity', 'txId');
    });
  }

};