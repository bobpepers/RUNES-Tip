'use strict';

// The User model.
var bcrypt = require('bcrypt-nodejs');
// import bcrypt from 'bcrypt-nodejs';
// 0: helpers
// Compares two passwords.
function comparePasswords(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

// Hashes the password for a user object.
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
    // tfa_secret_auth: {
    //  type: Sequelize.BOOLEAN,
    //  defaultValue: false,
    // },
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
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true,
    hooks: {
      beforeCreate: hashPassword
    }
  };

  // 3: Define the User model.
  var UserModel = sequelize.define('user', modelDefinition, modelOptions);
  UserModel.prototype.comparePassword = async function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.getDataValue('password'), function (err, isMatch) {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  };

  UserModel.associate = function (model) {
    UserModel.hasMany(model.jackpot, {
      as: 'winner_one'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_two'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_three'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_four'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_five'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_six'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_seven'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_eigth'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_nine'
    });

    UserModel.hasMany(model.jackpot, {
      as: 'winner_ten'
    });

    UserModel.hasMany(model.bannerslot);

    UserModel.hasMany(model.activity, {
      as: 'spender',
      foreignKey: 'spenderId'
    });

    UserModel.hasMany(model.activity, {
      as: 'earner',
      foreignKey: 'earnerId'
    });

    UserModel.hasMany(model.activityArchive, {
      as: 'archivedSpender',
      foreignKey: 'spenderId'
    });

    UserModel.hasMany(model.activityArchive, {
      as: 'archivedEarner',
      foreignKey: 'earnerId'
    });

    UserModel.hasMany(model.faucet);

    UserModel.hasMany(model.webslot);
    UserModel.hasMany(model.SurfTicket);

    UserModel.hasOne(model.wallet);

    UserModel.belongsToMany(model.ip, {
      through: 'IpUser',
      as: 'ips',
      foreignKey: 'userId',
      otherKey: 'ipId'
    });

    UserModel.belongsToMany(model.domain, {
      through: 'DomainUser',
      as: 'domains',
      foreignKey: 'userId',
      otherKey: 'domainId'
    });
    UserModel.hasMany(model.Referrals, {
      foreignKey: 'referredById',
      as: 'referredBy'
    });
    UserModel.hasMany(model.Referrals, {
      foreignKey: 'referrerID',
      as: 'referrer'
    });
  };

  return UserModel;
};
// module.exports = UserModel;