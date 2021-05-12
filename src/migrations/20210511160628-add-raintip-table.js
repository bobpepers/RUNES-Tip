module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('raintip', {
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
      rainId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'rain',
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
    await queryInterface.dropTable('raintip');
  },
};
