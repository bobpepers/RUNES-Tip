module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('cronjob', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: [
          'autoRain',
        ],
      },
      state: {
        type: DataTypes.ENUM,
        values: [
          'executing',
          'error',
          'finished',
        ],
      },
      expression: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('cronjob');
  },
};
