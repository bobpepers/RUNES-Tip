module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'triviaquestion', // name of Target model
      'enabled', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('triviaquestion', 'enabled');
  },
};
