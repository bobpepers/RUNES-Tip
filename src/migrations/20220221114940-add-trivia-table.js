module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('trivia', {
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
      feeAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ends: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userCount: {
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
        allowNull: false,
        references: {
          model: 'channel',
          key: 'id',
        },
      },
      triviaquestionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'triviaquestion',
          key: 'id',
        },
      },
      discordMessageId: {
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
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('trivia');
  },
};
