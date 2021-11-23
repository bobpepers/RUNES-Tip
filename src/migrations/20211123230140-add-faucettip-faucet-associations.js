module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activity',
      'faucettipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'faucettip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'faucettipId');
  },
};
