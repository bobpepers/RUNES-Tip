module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'address', // name of Source model
    'walletId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'wallet', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  )
    .then(() => queryInterface.addColumn(
      'transaction', // name of Target model
      'addressId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'address', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    )),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'address',
    'walletId',
  )
    .then(() => queryInterface.removeColumn(
      'transaction',
      'addressId',
    ))
  ,
};
