'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.changeColumn('activity', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus')
    });
    await queryInterface.changeColumn('activityArchive', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus')
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.changeColumn('activity', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned')
    });
    await queryInterface.changeColumn('activityArchive', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned')
    });
  }
};