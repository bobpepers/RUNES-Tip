module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'voicerain',
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
      'voicerain',
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
    await queryInterface.removeColumn('voicerain', 'groupId');
    await queryInterface.removeColumn('voicerain', 'channelId');
  },
};
