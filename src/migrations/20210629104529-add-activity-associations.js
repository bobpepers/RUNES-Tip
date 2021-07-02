module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activity', // name of Target model
      'userId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'spenderId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'earnerId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'transactionId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'transaction',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'userId');
    await queryInterface.removeColumn('activity', 'spenderId');
    await queryInterface.removeColumn('activity', 'earnerId');
    await queryInterface.removeColumn('activity', 'transactionId');
  },
};