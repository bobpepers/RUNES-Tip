// import mysql2 from 'mysql2';
import mysql2 from "mysql2";
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import PQueue from "p-queue";
import { config } from 'dotenv';

config();

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    port: process.env.DB_PORT,
    retry: {
      match: [
        Sequelize.ConnectionError,
        Sequelize.ConnectionTimedOutError,
        Sequelize.TimeoutError,
      ],
      max: 3,
    },
  },
);

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.queue = new PQueue({ concurrency: (sequelize.connectionManager.pool.maxSize - 1) });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.queueTransaction = (iso, fn) => sequelize.queue.add(
  () => sequelize.transaction((iso, fn)),
);

// module.exports = db;
export default db;
