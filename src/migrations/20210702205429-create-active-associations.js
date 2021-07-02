module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'active', // name of Target model
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
      'active',
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
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('active', 'groupId');
    await queryInterface.removeColumn('active', 'userId');
  },
};
