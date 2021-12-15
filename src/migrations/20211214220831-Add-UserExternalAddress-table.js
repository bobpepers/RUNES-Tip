module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('UserAddressExternal', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      addressExternalId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'addressExternal',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('UserAddressExternal');
  },
};
