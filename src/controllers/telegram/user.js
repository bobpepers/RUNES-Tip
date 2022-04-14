import { Transaction } from "sequelize";
import db from '../../models';
import { welcomeMessage } from '../../messages/telegram';
import { getInstance } from "../../services/rclient";
import getCoinSettings from '../../config/settings';
import { coin } from "../../config/runebaseSettings";

const settings = getCoinSettings();

export const createUpdateUser = async (
  ctx,
) => {
  let userId;
  let username = '';
  let firstname = '';
  let lastname = '';
  let isNewUser = false;
  if (
    ctx
      && ctx.update
      && ctx.update.message
      && ctx.update.message.from
      && ctx.update.message.from.id
  ) {
    userId = ctx.update.message.from.id;
    username = ctx.update.message.from.username ? ctx.update.message.from.username : '';
    firstname = ctx.update.message.from.first_name ? ctx.update.message.from.first_name : '';
    lastname = ctx.update.message.from.last_name ? ctx.update.message.from.last_name : '';
  } else if (
    ctx
      && ctx.update
      && ctx.update.callback_query
      && ctx.update.callback_query.from
      && ctx.update.callback_query.from.id
  ) {
    userId = ctx.update.callback_query.from.id;
    username = ctx.update.callback_query.from.username ? ctx.update.callback_query.from.username : '';
    firstname = ctx.update.callback_query.from.first_name ? ctx.update.callback_query.from.first_name : '';
    lastname = ctx.update.callback_query.from.last_name ? ctx.update.callback_query.from.last_name : '';
  }
  if (
    ctx
    && ctx.update
    && ctx.update.message
    && ctx.update.message.from
    && ctx.update.message.from.is_bot
  ) {
    return;
  }
  if (
    ctx
    && ctx.update
    && ctx.update.callback_query
    && ctx.update.callback_query.from
    && ctx.update.callback_query.from.is_bot
  ) {
    return;
  }

  if (!userId) {
    return;
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let user = await db.user.findOne(
      {
        where: {
          user_id: `telegram-${userId}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    if (!user && userId) {
      user = await db.user.create({
        user_id: `telegram-${userId}`,
        username,
        firstname,
        lastname,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (user) {
      if (
        user.firstname !== firstname
          || user.lastname !== lastname
          || user.username !== username
      ) {
        user = await user.update(
          {
            firstname,
            lastname,
            username,
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
      }
      let wallet = await db.wallet.findOne(
        {
          where: {
            userId: user.id,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!wallet) {
        wallet = await db.wallet.create({
          userId: user.id,
          available: 0,
          locked: 0,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        isNewUser = true;
      }
      if (wallet) {
        let address = await db.address.findOne(
          {
            where: {
              walletId: wallet.id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (!address) {
          const newAddress = await getInstance().getNewAddress();
          const addressAlreadyExist = await db.address.findOne(
            {
              where: {
                address: newAddress,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
          if (!addressAlreadyExist) {
            address = await db.address.create({
              address: newAddress,
              walletId: wallet.id,
              type: 'deposit',
              confirmed: true,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          }
        }
      }
    }

    t.afterCommit(async () => {
      if (
        isNewUser
        && settings.coin.setting !== 'Pirate'
      ) {
        try {
          await ctx.replyWithHTML(
            await welcomeMessage(
              user,
            ),
          );
        } catch (e) {
          console.log(e);
        }
      }
    });
  }).catch((err) => {
    console.log(err);
  });
};

export const updateLastSeen = async (
  ctx,
) => {
  let userId;
  let chatId;
  if (
    ctx
      && ctx.update
      && ctx.update.message
      && ctx.update.message.from
      && ctx.update.message.from.id
  ) {
    userId = ctx.update.message.from.id;
  } else if (
    ctx
      && ctx.update
      && ctx.update.callback_query
      && ctx.update.callback_query.from
      && ctx.update.callback_query.from.id
  ) {
    userId = ctx.update.callback_query.from.id;
  }
  if (
    ctx
      && ctx.update
      && ctx.update.message
      && ctx.update.message.chat
      && ctx.update.message.chat.id
  ) {
    chatId = ctx.update.message.chat.id;
  } else if (
    ctx
      && ctx.update
      && ctx.update.callback_query
      && ctx.update.callback_query.message
      && ctx.update.callback_query.message.chat
      && ctx.update.callback_query.message.chat.id
  ) {
    chatId = ctx.update.callback_query.message.chat.id;
  }
  let updatedUser;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne(
      {
        where: {
          user_id: `telegram-${userId}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    const group = await db.group.findOne(
      {
        where: {
          groupId: `telegram-${chatId}`,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    if (group) {
      if (user) {
        const active = await db.active.findOne(
          {
            where: {
              userId: user.id,
              groupId: group.id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (active) {
          const updatedActive = await active.update(
            {
              lastSeen: new Date(Date.now()),
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        if (!active) {
          const updatedActive = await db.active.create(
            {
              groupId: group.id,
              userId: user.id,
              lastSeen: new Date(Date.now()),
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
      }
    }

    if (user) {
      updatedUser = await user.update(
        {
          lastSeen: new Date(Date.now()),
        },
        {
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
  });

  return updatedUser;
};
