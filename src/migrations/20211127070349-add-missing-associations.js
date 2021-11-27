module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'flood', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'flood', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'floodtip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'floodtip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'hurricane', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'hurricane', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'hurricanetip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'hurricanetip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'rain', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'rain', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'raintip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'raintip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'sleet', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'sleet', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'sleettip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'sleettip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'soak', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'soak', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'soaktip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'soaktip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'thunder', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'thunder', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'thundertip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'thundertip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'thunderstorm', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'thunderstorm', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'thunderstormtip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'thunderstormtip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'reactdroptip', // name of Target model
      'groupId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'group', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'reactdroptip', // name of Target model
      'channelId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'channel', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('flood', 'groupId');
    await queryInterface.removeColumn('flood', 'channelId');
    await queryInterface.removeColumn('floodtip', 'groupId');
    await queryInterface.removeColumn('floodtip', 'channelId');

    await queryInterface.removeColumn('hurricane', 'groupId');
    await queryInterface.removeColumn('hurricane', 'channelId');
    await queryInterface.removeColumn('hurricanetip', 'groupId');
    await queryInterface.removeColumn('hurricanetip', 'channelId');

    await queryInterface.removeColumn('rain', 'groupId');
    await queryInterface.removeColumn('rain', 'channelId');
    await queryInterface.removeColumn('raintip', 'groupId');
    await queryInterface.removeColumn('raintip', 'channelId');

    await queryInterface.removeColumn('sleet', 'groupId');
    await queryInterface.removeColumn('sleet', 'channelId');
    await queryInterface.removeColumn('sleettip', 'groupId');
    await queryInterface.removeColumn('sleettip', 'channelId');

    await queryInterface.removeColumn('soak', 'groupId');
    await queryInterface.removeColumn('soak', 'channelId');
    await queryInterface.removeColumn('soaktip', 'groupId');
    await queryInterface.removeColumn('soaktip', 'channelId');

    await queryInterface.removeColumn('thunder', 'groupId');
    await queryInterface.removeColumn('thunder', 'channelId');
    await queryInterface.removeColumn('thundertip', 'groupId');
    await queryInterface.removeColumn('thundertip', 'channelId');

    await queryInterface.removeColumn('thunderstorm', 'groupId');
    await queryInterface.removeColumn('thunderstorm', 'channelId');
    await queryInterface.removeColumn('thunderstormtip', 'groupId');
    await queryInterface.removeColumn('thunderstormtip', 'channelId');

    await queryInterface.removeColumn('reactdroptip', 'groupId');
    await queryInterface.removeColumn('reactdroptip', 'channelId');
  },
};
