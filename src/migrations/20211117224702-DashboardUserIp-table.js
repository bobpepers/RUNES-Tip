module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('IpDashboardUser', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dashboardUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'dashboardUser',
          key: 'id',
          as: 'dashboardUsers',
        },
      },
      ipId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'ip',
          key: 'id',
          as: 'ips',
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
    await queryInterface.dropTable('IpDashboardUser');
  },
};
