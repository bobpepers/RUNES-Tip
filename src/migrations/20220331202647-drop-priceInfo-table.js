module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('priceInfo');
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('priceInfo', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.STRING,
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
};
