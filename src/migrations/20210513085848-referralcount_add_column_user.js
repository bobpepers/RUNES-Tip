module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user', // name of Target model
      'referral_count', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user', 'referral_count');
  },
};
