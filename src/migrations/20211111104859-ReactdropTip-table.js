module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('reactdroptip', {
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
      status: {
        type: DataTypes.ENUM,
        values: [
          'waiting',
          'failed',
          'success',
        ],
      },
      captchaType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      solution: {
        type: DataTypes.STRING,
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
      reactdropId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'reactdrop',
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
    await queryInterface.dropTable('reactdroptip');
  },
};
