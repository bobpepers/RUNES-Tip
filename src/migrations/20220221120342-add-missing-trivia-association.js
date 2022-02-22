module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activity', // name of Target model
      'triviaId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'trivia', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity', // name of Target model
      'triviatipId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'triviatip', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'triviaId');
    await queryInterface.removeColumn('activity', 'triviatipId');
  },
};
