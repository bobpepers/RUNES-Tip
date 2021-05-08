'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('activityArchive', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.ENUM,
        values: ['login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned']
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      spender_balance: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      earner_balance: {
        type: DataTypes.BIGINT,
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
    await queryInterface.dropTable('activityArchive');
  }
};

//