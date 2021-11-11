module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('channel', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      channelId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastActive: {
        type: DataTypes.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('channel');
  },
};
