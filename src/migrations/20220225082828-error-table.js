module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('error', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        nique: false,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
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
    await queryInterface.dropTable('error');
  },
};
