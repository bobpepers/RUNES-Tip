'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('jackpot', 'winnerOneId', {
      type: Sequelize.BIGINT,
      references: {
        model: 'user',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerTwoId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerThreeId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerFourId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerFiveId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerSixId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerSevenId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerEigthId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerNineId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'winnerTenId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('jackpot', 'userId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('bannerslot', 'userId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('activity', 'spenderId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('activity', 'earnerId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('webslot', 'userId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('SurfTicket', 'userId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }).then(function () {
      return queryInterface.addColumn('wallet', 'userId', {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    });
  },

  down: function down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('jackpot', 'winnerOneId').then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerTwoId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerThreeId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerFourId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerFiveId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerSixId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerSevenId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerEigthId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerNineId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'winnerTenId');
    }).then(function () {
      return queryInterface.removeColumn('jackpot', 'userId');
    }).then(function () {
      return queryInterface.removeColumn('bannerslot', 'userId');
    }).then(function () {
      return queryInterface.removeColumn('activity', 'spenderId');
    }).then(function () {
      return queryInterface.removeColumn('activity', 'earnerId');
    }).then(function () {
      return queryInterface.removeColumn('webslot', 'userId');
    }).then(function () {
      return queryInterface.removeColumn('SurfTicket', 'userId');
    }).then(function () {
      return queryInterface.removeColumn('wallet', 'userId');
    });
  }

};