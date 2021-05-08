'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('jackpot', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      jackpot_amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      total_tickets: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      endsAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      phase: {
        type: DataTypes.ENUM,
        values: ['running', 'complete'],
        defaultValue: 'running'
      },
      winner_one_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_two_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_three_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_four_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_five_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_six_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_seven_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_eight_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_nine_tickets: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      winner_ten_tickets: {
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
    await queryInterface.dropTable('jackpot');
  }
};