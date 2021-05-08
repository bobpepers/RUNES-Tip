'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.createTable('user', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      authtoken: {
        type: DataTypes.STRING
      },
      authused: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      authexpires: {
        type: DataTypes.DATE
      },
      resetpasstoken: {
        type: DataTypes.STRING
      },
      resetpassused: {
        type: DataTypes.BOOLEAN
      },
      resetpassexpires: {
        type: DataTypes.DATE
      },
      role: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      reputation: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 50
      },
      banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      webslot_amount: {
        type: DataTypes.SMALLINT,
        defaultValue: 2
      },
      bannerslot_amount: {
        type: DataTypes.SMALLINT,
        defaultValue: 1
      },
      tfa: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      tfa_secret: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      surf_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      click_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      jackpot_tickets: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      lastClicked: {
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.dropTable('user');
  }
};