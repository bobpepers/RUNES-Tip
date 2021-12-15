module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'transaction', // name of Target model
      'addressExternalId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'addressExternal', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('transaction', 'addressExternalId');
  },
};
