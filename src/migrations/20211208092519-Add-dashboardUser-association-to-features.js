module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'features', // name of Target model
      'dashboardUserId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'dashboardUser', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('features', 'dashboardUserId');
  },
};
