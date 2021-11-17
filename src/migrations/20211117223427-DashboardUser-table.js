module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('dashboardUser', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authtoken: {
        type: DataTypes.STRING,
      },
      authused: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      authexpires: {
        type: DataTypes.DATE,
      },
      resetpasstoken: {
        type: DataTypes.STRING,
      },
      resetpassused: {
        type: DataTypes.BOOLEAN,
      },
      resetpassexpires: {
        type: DataTypes.DATE,
      },
      role: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tfa: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tfa_secret: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      lastSeen: {
        type: DataTypes.DATE,
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
    await queryInterface.dropTable('dashboardUser');
  },
};
