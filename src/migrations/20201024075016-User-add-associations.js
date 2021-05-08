module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'wallet',
    'userId',
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'wallet',
    'userId',
  ),
};
