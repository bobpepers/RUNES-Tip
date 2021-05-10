import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');
/**
 * Fetch Wallet
 */
export const createUpdateUser = async (ctx) => {
  console.log('32111');
  console.log(ctx);
  console.log(ctx.update.message.from);
  if (!ctx.update.message.from.is_bot) {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      let user = await db.user.findOne(
        {
          where: {
            user_id: `telegram-${ctx.update.message.from.id}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      console.log(user);
      if (!user) {
        user = await db.user.create({
          user_id: `telegram-${ctx.update.message.from.id}`,
          username: ctx.update.message.from.username,
          firstname: ctx.update.message.from.first_name,
          lastname: ctx.update.message.from.last_name,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (user) {
        if (user.firstname !== ctx.update.message.from.first_name) {
          user = await user.update(
            {
              firstname: ctx.update.message.from.first_name,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        if (user.lastname !== ctx.update.message.from.last_name) {
          user = await user.update(
            {
              lastname: ctx.update.message.from.last_name,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
        }
        if (user.username !== ctx.update.message.from.username) {
          user = await user.update(
            {
              username: ctx.update.message.from.username,
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
        }
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
          console.log('adress not found');
          const newAddress = await getInstance().getNewAddress();
          console.log(newAddress);
          address = await db.address.create({
            address: newAddress,
            walletId: wallet.id,
            type: 'deposit',
            confirmed: true,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          ctx.reply(`Welcome ${ctx.update.message.from.username}, we created a wallet for you.
Type "/runestip help" for usage info`);
        }
      }

      t.afterCommit(() => {
        console.log('done');
        //ctx.reply(`done`);
      });
    }).catch((err) => {
      console.log(err.message);
    });

    // Explicit usage

    //ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

    // Using context shortcut
    
  }
};

export const fetchUser = async (req, res, next) => {
  console.log(req.user.id);
  console.log('begin fetch user');
  res.locals.user = await db.user.findOne({
    where: {
      id: req.user.id,
    },
    attributes: {
      exclude: [
        'password',
        'id',
        'authtoken',
        'authused',
        'authexpires',
        'resetpasstoken',
        'resetpassused',
        'resetpassexpires',
        'updatedAt',
      ],
    },
    include: [
      {
        model: db.Referrals,
        required: false,
        as: 'referredBy',
        attributes: ['earned'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userReferrer',
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.trusted,
        as: 'trustedUsers',
        required: false,
        attributes: ['id'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userTrust',
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.blocked,
        as: 'blockedUsers',
        required: false,
        attributes: ['id'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userBlock',
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.wallet,
        as: 'wallet',
        attributes: {
          exclude: [
            'userId',
            'createdAt',
            'id',
          ],
        },
        include: [
          {
            model: db.address,
            as: 'addresses',
            include: [
              {
                model: db.transaction,
                as: 'transactions',
              },
            ],
          },
        ],
      },

    ],
  });
  console.log(res.locals.user);
  console.log('end user controller');
  next();
};

export const fetchSpecificUser = async (req, res, next) => {
  console.log('fetch speicic user start');
  console.log(req.body);
  res.locals.user = await db.user.findOne({
    where: {
      username: req.body.user,
    },
    attributes: [
      'username',
      'volume',
      'authused',
      'banned',
      'avatar_path',
      'phoneNumberVerified',
      'identityVerified',
      'bio',
      'open_store',
      'tradeCount',
      'online',
      'lastSeen',
      'firstTrade',
      'createdAt',
      // [Sequelize.fn('AVG', Sequelize.col('userRated.rating')), 'avgRating'],
    ],
    order: [
      [{ model: db.rating, as: 'userRating' }, 'id', 'DESC'],
      [{ model: db.rating, as: 'userRated' }, 'id', 'DESC'],
    ],
    // group: ['userRated.id'],
    include: [
      {
        model: db.rating,
        as: 'userRating',
        attributes: [
          'updatedAt',
          'createdAt',
          'id',
          'feedback',
          'rating',
        ],
        required: false,
        include: [
          {
            model: db.user,
            as: 'userRating',
            attributes: [
              'username',
              'avatar_path',
            ],
          },
        ],
      },
      {
        model: db.rating,
        as: 'userRated',
        attributes: [
          'updatedAt',
          'createdAt',
          'id',
          'feedback',
          'rating',
        ],
        include: [
          {
            model: db.user,
            as: 'userRating',
            attributes: [
              'username',
              'avatar_path',
            ],
          },
        ],
        // attributes: [],
        required: false,
      },
      {
        model: db.Referrals,
        required: false,
        as: 'referredBy',
        attributes: ['earned'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userReferrer',
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.trusted,
        as: 'trustedUsers',
        required: false,
        attributes: ['id'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userTrust',
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.blocked,
        as: 'blockedUsers',
        required: false,
        attributes: ['id'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userBlock',
            attributes: ['username'],
          },
        ],
      },

    ],
  });
  console.log(res.locals.user);
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  console.log('end user controller fetchSpecificUser');
  next();
};

export const updateBio = async (req, res, next) => {
  if (!req.body.bio.description) {
    res.locals.error = 'BIO_NOT_FOUND';
    return next();
  }
  if (req.body.bio.description > 400) {
    res.locals.error = 'BIO_LENGTH_TOO_LONG';
    return next();
  }
  const bio = await db.user.update(
    {
      bio: req.body.bio.description,
    },
    {
      where: {
        id: req.user.id,
      },
    },
  );
  if (!bio) {
    res.locals.error = "UPDATE_BIO_ERROR";
    return next();
  }
  res.locals.bio = bio;
  next();
};

export const updateStoreStatus = async (req, res, next) => {
  console.log("updateStoreStatus");
  const store = await db.user.findOne(
    {
      where: {
        id: req.user.id,
      },
    },
  );
  console.log(store);
  if (!store) {
    res.locals.error = "UPDATE_STORE_STATUS_ERROR";
    return next();
  }
  const updatedStore = await store.update(
    {
      open_store: !store.open_store,
    },
    {
      where: {
        id: req.user.id,
      },
    },
  );
  if (!updatedStore) {
    res.locals.error = "UPDATE_STORE_STATUS_ERROR";
    return next();
  }
  console.log(updatedStore);
  if (updatedStore.open_store) {
    res.locals.store = 'true';
  } else {
    res.locals.store = 'false';
  }

  console.log(res.locals.store);
  console.log("updateStoreStatus end");
  next();
};

export const updateLastSeen = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne(
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    console.log(user);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    const updatedUser = await user.update(
      {
        lastSeen: new Date(Date.now()),
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

/**
 * Fetch Wallet
 */
export const dbsync = async (req, res, next) => {
  db.sequelize.sync().then(() => {
    res.status(201).json({ message: 'Tables Created' });
  });
};
