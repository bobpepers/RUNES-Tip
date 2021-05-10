module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user', // name of Target model
      'user_id', // name of the key we're adding
      {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'user', // name of Target model
      'firstname', // name of the key we're adding
      {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
      },
    );
    await queryInterface.addColumn(
      'user', // name of Target model
      'lastname', // name of the key we're adding
      {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user', 'user_id');
    await queryInterface.removeColumn('user', 'firstname');
    await queryInterface.removeColumn('user', 'lastname');
  },
};
