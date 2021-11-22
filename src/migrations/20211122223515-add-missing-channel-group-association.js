module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'channel', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('channel', 'groupId');
  },
};
