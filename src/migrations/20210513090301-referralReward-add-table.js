module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('referralReward', {
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
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      count: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
    await queryInterface.dropTable('referralReward');
  },
};
