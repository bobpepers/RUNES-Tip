module.exports = {
  up: async (
    queryInterface,
    DataTypes,
  ) => {
    await queryInterface.changeColumn(
      'user',
      'username',
      {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
      },
    );
  },
  down: async (
    queryInterface,
    DataTypes,
  ) => {
    await queryInterface.changeColumn(
      'user',
      'username',
      {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    );
  },
};
