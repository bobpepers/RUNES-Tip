module.exports = {
  up: async (
    queryInterface,
    DataTypes,
  ) => {
    await queryInterface.removeConstraint("user", "username");
    await queryInterface.changeColumn(
      'user',
      'username',
      {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
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
