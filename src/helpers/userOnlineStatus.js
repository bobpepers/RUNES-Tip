import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

async function setUserOnline(userId) {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(userId);
    const user = await db.user.findOne(
      {
        where: {
          id: userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    console.log(user);
    if (!user) {
      return;
    }
    const updatedUser = await user.update(
      {
        online: true,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    t.afterCommit(() => {
      console.log('commited');
    });
  });
}

async function setUserOffline(userId) {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(userId);
    const user = await db.user.findOne(
      {
        where: {
          id: userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    console.log(user);
    if (!user) {
      return;
    }
    const updatedUser = await user.update(
      {
        online: false,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    t.afterCommit(() => {
      console.log('commited');
    });
  });
}

async function patchUserOfflineStatus(onlineUsers) {
  const onlineUsersFromDB = await db.user.findAll({
    where: {
      online: true,
    },
  });

  onlineUsersFromDB.forEach(async (user) => {
    if (!onlineUsers[user.id.toString()]) {
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        await user.update({
          online: false,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        t.afterCommit(() => {
          console.log('commited');
        });
      });
    }
  });
}

module.exports = {
  setUserOnline,
  setUserOffline,
  patchUserOfflineStatus,
};
