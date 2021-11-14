module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('soaktip', {
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
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      soakId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'soak',
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
    await queryInterface.dropTable('soaktip');
  },
};
