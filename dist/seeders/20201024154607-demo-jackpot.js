'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('jackpot', [{
      id: 1,
      jackpot_amount: 90000000000,
      total_tickets: 0,
      endsAt: new Date(Date.now() + 3 * 60 * 1000),
      phase: 'running',
      winner_one_tickets: null,
      winner_two_tickets: null,
      winner_three_tickets: null,
      winner_four_tickets: null,
      winner_five_tickets: null,
      winner_six_tickets: null,
      winner_seven_tickets: null,
      winner_eight_tickets: null,
      winner_nine_tickets: null,
      winner_ten_tickets: null,
      winnerOneId: null,
      winnerTwoId: null,
      winnerThreeId: null,
      winnerFourId: null,
      winnerFiveId: null,
      winnerSixId: null,
      winnerSevenId: null,
      winnerEigthId: null,
      winnerNineId: null,
      winnerTenId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('jackpot', null, {});
  }
};