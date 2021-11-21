module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'channel', // name of Target model
      'channelName', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );
    await queryInterface.addColumn(
      'channel', // name of Target model
      'banned', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('channel', 'channelName');
    await queryInterface.removeColumn('channel', 'banned');
  },
};
