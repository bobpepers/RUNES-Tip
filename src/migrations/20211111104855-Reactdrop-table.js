module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('reactdrop', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ends: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userCount: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      groupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'group',
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
    await queryInterface.dropTable('reactdrop');
  },
};
