'use strict';

// import mysql2 from 'mysql2';
var mysql2 = require('mysql2');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');

var _require = require('p-queue'),
    PQueue = _require.default;

var basename = path.basename(__filename);
var db = {};
require('dotenv').config();

var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
  port: process.env.DB_PORT,
  retry: {
    match: [Sequelize.ConnectionError, Sequelize.ConnectionTimedOutError, Sequelize.TimeoutError],
    max: 3
  }
});

fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
  var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.queue = new PQueue({ concurrency: sequelize.connectionManager.pool.maxSize - 1 });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.queueTransaction = function (iso, fn) {
  return sequelize.queue.add(function () {
    return sequelize.transaction((iso, fn));
  });
};

module.exports = db;