module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'features', // name of Target model
      'maxSampleSize', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 400,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('features', 'maxSampleSize');
  },
};
