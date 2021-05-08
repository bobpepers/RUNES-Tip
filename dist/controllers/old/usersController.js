'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUserCount = exports.fetchUser = exports.fetchUsers = undefined;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch user firstnames
 */
var fetchUsers = exports.fetchUsers = function fetchUsers(req, res, next) {
  console.log('fetchUsers');
  _user2.default.find({}, 'firstname', function (err, users) {
    if (err) {
      return next(err);
    }

    res.json(users);
  });
};

var fetchUser = exports.fetchUser = function fetchUser(token) {
  console.log('fetchUser');
  console.log(token);
  var loggedUser = _user2.default.findOne({ _id: token }, 'firstname', function (err, users) {
    if (err) {
      return next(err);
    }
    console.log(users);
    return users;
  });
};

var fetchUserCount = exports.fetchUserCount = function fetchUserCount(req, res, next) {
  console.log('fetchUserCount');
  _user2.default.estimatedDocumentCount({}, function (err, count) {
    if (err) {
      return next(err);
    }
    console.log(count); // this will print the count to console
    res.json(count);
  });
};