// The User model.
const bcrypt = require('bcrypt-nodejs');
// import bcrypt from 'bcrypt-nodejs';
// 0: helpers
// Compares two passwords.
function comparePasswords(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

// Hashes the password for a user object.
function hashPassword(user, options) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) reject(err);
        user.setDataValue("password", hash);
        resolve();
      });
    });
  });
}

module.exports = (sequelize, DataTypes) => {
// 1: The model schema.
  const modelDefinition = {
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
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
    hooks: {
      beforeCreate: hashPassword,
    },
  };

  // 3: Define the User model.
  const DashboardUserModel = sequelize.define('dashboardUser', modelDefinition, modelOptions);
  DashboardUserModel.prototype.comparePassword = async function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.getDataValue('password'), (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  };

  DashboardUserModel.associate = (model) => {
    DashboardUserModel.belongsToMany(model.ip, {
      through: 'IpDashboardUser',
      as: 'ips',
      foreignKey: 'dashboardUserId',
      otherKey: 'ipId',
    });
  };

  return DashboardUserModel;
};
