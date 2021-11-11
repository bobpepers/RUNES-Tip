module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'reactdrop', // name of Target model
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
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('reactdrop', 'userId');
  },
};
