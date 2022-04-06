module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('trivia', 'discordMessageId', 'messageId');
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('trivia', 'messageId', 'discordMessageId');
  },
};
