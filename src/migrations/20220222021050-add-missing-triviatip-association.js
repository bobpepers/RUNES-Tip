module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'triviatip', // name of Target model
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
    await queryInterface.addColumn(
      'triviatip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('triviatip', 'groupId');
    await queryInterface.removeColumn('triviatip', 'Id');
  },
};
