'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('clickOrder', // name of Target model
    'bannerslotId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'bannerslot', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    // await queryInterface.addColumn(
    //  'bannerslot', // name of Source model
    //  'userId', // name of the key we're adding
    //  {
    //    type: Sequelize.BIGINT,
    //    references: {
    //      model: 'user', // name of Target model
    //      key: 'id', // key in Target model that we're referencing
    //    },
    //    onUpdate: 'CASCADE',
    //    onDelete: 'SET NULL',
    //  },
    // );
  },
  down: async function down(queryInterface, DataTypes) {
    // await queryInterface.removeColumn('bannerslot', 'userId');
    await queryInterface.removeColumn('clickOrder', 'bannerslotId');
  }
};