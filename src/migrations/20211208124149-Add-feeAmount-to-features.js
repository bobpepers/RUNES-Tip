module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'flood', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'hurricane', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'rain', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'reactdrop', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'sleet', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'soak', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'thunder', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'thunderstorm', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'tip', // name of Target model
      'feeAmount', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('flood', 'feeAmount');
    await queryInterface.removeColumn('hurricane', 'feeAmount');
    await queryInterface.removeColumn('rain', 'feeAmount');
    await queryInterface.removeColumn('reactdrop', 'feeAmount');
    await queryInterface.removeColumn('sleet', 'feeAmount');
    await queryInterface.removeColumn('soak', 'feeAmount');
    await queryInterface.removeColumn('thunder', 'feeAmount');
    await queryInterface.removeColumn('thunderstorm', 'feeAmount');
    await queryInterface.removeColumn('tip', 'feeAmount');
  },
};
