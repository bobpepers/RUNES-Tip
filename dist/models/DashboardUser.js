"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

// The User model.
var bcrypt = require('bcrypt-nodejs'); // import bcrypt from 'bcrypt-nodejs';
// 0: helpers
// Compares two passwords.


function comparePasswords(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
} // Hashes the password for a user object.


function hashPassword(user, options) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(12, function (err, salt) {
      if (err) reject(err);
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) reject(err);
        user.setDataValue("password", hash);
        resolve();
      });
    });
  });
}

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
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
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tfa: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tfa_secret: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true,
    hooks: {
      beforeCreate: hashPassword
    }
  }; // 3: Define the User model.

  var DashboardUserModel = sequelize.define('dashboardUser', modelDefinition, modelOptions);

  DashboardUserModel.prototype.comparePassword = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(candidatePassword, cb) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              bcrypt.compare(candidatePassword, this.getDataValue('password'), function (err, isMatch) {
                if (err) return cb(err);
                return cb(null, isMatch);
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  DashboardUserModel.associate = function (model) {
    DashboardUserModel.belongsToMany(model.ip, {
      through: 'IpDashboardUser',
      as: 'ips',
      foreignKey: 'dashboardUserId',
      otherKey: 'ipId'
    });
    DashboardUserModel.hasMany(model.features);
  };

  return DashboardUserModel;
};