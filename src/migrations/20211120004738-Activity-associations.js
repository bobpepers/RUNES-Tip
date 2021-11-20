module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activity', // name of Target model
      'soakId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'soak', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'rainId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'rain',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'floodId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'flood',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'tipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'tip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'thunderId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'thunder',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'thunderstormId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'thunderstorm',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'reactdropId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'reactdrop',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'sleetId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'sleet',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'reactdroptipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'reactdroptip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'sleettipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'sleettip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'thunderstormtipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'thunderstormtip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'thundertipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'thundertip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'soaktipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'soaktip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'raintipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'raintip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity',
      'floodtipId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'floodtip',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activity', 'tipId');
    await queryInterface.removeColumn('activity', 'floodId');
    await queryInterface.removeColumn('activity', 'rainId');
    await queryInterface.removeColumn('activity', 'soakId');
    await queryInterface.removeColumn('activity', 'thunderId');
    await queryInterface.removeColumn('activity', 'thunderstormId');
    await queryInterface.removeColumn('activity', 'reactdropId');
    await queryInterface.removeColumn('activity', 'sleetId');

    await queryInterface.removeColumn('activity', 'reactdroptipId');
    await queryInterface.removeColumn('activity', 'sleettipId');
    await queryInterface.removeColumn('activity', 'thunderstormtipId');
    await queryInterface.removeColumn('activity', 'thundertipId');
    await queryInterface.removeColumn('activity', 'soaktipId');
    await queryInterface.removeColumn('activity', 'raintipId');
    await queryInterface.removeColumn('activity', 'floodtipId');
  },
};
