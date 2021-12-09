module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activity', // name of Target model
      'voicerainId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'voicerain', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity', // name of Target model
      'voiceraintipId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'voiceraintip', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'voicerainId');
    await queryInterface.removeColumn('activity', 'voiceraintipId');
  },
};
