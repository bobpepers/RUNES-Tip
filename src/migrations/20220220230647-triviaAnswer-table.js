module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('triviaanswer', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      triviaquestionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'triviaquestion',
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
    await queryInterface.dropTable('triviaanswer');
  },
};
