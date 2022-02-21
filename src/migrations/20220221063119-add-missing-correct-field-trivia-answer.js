module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'triviaanswer', // name of Target model
      'correct', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('triviaanswer', 'correct');
  },
};
