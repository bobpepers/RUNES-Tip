module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('tiptip', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.BIGINT,
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
      tipId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'tip',
          key: 'id',
        },
      },
      groupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'group',
          key: 'id',
        },
      },
      channelId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'channel',
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
    await queryInterface.dropTable('tiptip');
  },
};
