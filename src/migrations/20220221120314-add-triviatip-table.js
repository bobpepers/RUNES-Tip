module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('triviatip', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      triviaId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'trivia',
          key: 'id',
        },
      },
      triviaanswerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'triviaanswer',
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
    await queryInterface.dropTable('triviatip');
  },
};
