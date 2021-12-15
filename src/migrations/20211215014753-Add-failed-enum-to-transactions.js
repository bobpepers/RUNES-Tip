// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
//
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('transaction', 'phase', {
        type: DataTypes.ENUM(
          'review',
          'pending',
          'confirming',
          'confirmed',
          'rejected',
          'failed',
        ),
      });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('transaction', 'phase', {
        type: DataTypes.ENUM(
          'review',
          'pending',
          'confirming',
          'confirmed',
          'rejected',
        ),
      });
  },
};
