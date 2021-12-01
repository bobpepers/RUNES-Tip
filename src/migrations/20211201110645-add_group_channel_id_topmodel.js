module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tip',
      'groupId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'tip',
      'channelId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('tip', 'groupId');
    await queryInterface.removeColumn('tip', 'channelId');
  },
};
