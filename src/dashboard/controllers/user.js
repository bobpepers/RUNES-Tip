import { Transaction } from 'sequelize';
import db from '../../models';

export const fetchUser = async (
  req,
  res,
  next,
) => {
  res.locals.user = await db.dashboardUser.findOne({
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
  });
  next();
};

export const updateLastSeen = async (
  req,
  res,
  next,
) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.dashboardUser.findOne(
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
