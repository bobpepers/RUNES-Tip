"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mysql = _interopRequireDefault(require("mysql2"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _pQueue = _interopRequireDefault(require("p-queue"));

// import mysql2 from 'mysql2';
require('dotenv').config();

var basename = _path["default"].basename(__filename);

var db = {};
var sequelize = new _sequelize["default"](process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: _mysql["default"],
  port: process.env.DB_PORT,
  retry: {
    match: [_sequelize["default"].ConnectionError, _sequelize["default"].ConnectionTimedOutError, _sequelize["default"].TimeoutError],
    max: 3
  }
});

_fs["default"].readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
  var model = require(_path["default"].join(__dirname, file))(sequelize, _sequelize["default"].DataTypes);

  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize.queue = new _pQueue["default"]({
  concurrency: sequelize.connectionManager.pool.maxSize - 1
});
db.sequelize = sequelize;
db.Sequelize = _sequelize["default"];

db.queueTransaction = function (iso, fn) {
  return sequelize.queue.add(function () {
    return sequelize.transaction((iso, fn));
  });
}; // module.exports = db;


var _default = db;
exports["default"] = _default;