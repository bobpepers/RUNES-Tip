module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'reactdrop', // name of Target model
      'ended', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
    await queryInterface.addColumn(
      'reactdrop', // name of Target model
      'emoji', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '❤️',
      },
    );
    await queryInterface.addColumn(
      'reactdrop', // name of Target model
      'discordMessageId', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('reactdrop', 'ended');
    await queryInterface.removeColumn('reactdrop', 'emoji');
    await queryInterface.removeColumn('reactdrop', 'discordMessageId');
  },
};
