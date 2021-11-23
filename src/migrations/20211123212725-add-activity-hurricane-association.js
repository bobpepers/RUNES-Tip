module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activity',
      'hurricaneId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'hurricane',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'hurricanetipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'hurricanetip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'hurricaneId');
    await queryInterface.removeColumn('activity', 'hurricanetipId');
  },
};
