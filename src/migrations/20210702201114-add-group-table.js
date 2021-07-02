module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('group', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      groupId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('group');
  },
};
