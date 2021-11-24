"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('wallet', [{
      id: 1,
      available: 1000000000,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      available: 10000000000,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 6,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 7,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 8,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 9,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 10,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 12,
      available: 0,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('wallet', null, {});
  }
};