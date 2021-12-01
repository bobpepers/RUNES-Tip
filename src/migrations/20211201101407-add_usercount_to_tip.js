module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'tip', // name of Target model
      'userCount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('tip', 'userCount');
  },
};
