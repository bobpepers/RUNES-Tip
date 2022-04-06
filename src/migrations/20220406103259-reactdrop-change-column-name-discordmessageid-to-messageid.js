module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('reactdrop', 'discordMessageId', 'messageId');
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('reactdrop', 'messageId', 'discordMessageId');
  },
};
