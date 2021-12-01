module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn(
      'tip',
      'userTippedId',
      {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn(
      'tip',
      'userTippedId',
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
  },
};
