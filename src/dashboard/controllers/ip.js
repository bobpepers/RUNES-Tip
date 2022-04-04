import {
  Transaction,
} from 'sequelize';
import db from '../../models';

/**
 *
 * Is IP Banned?
 */
export const isIpBanned = async (
  req,
  res,
  next,
) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const banned = await db.ip.find({
    where: {
      address: ip,
      banned: true,
    },
  });
  console.log('isUserBaipnned');
  console.log(req.user);
  if (banned) {
    req.logOut();
    req.session.destroy();
    res.status(401).send({
      error: 'IP_BANNED',
    });
  } else {
    next();
  }
};

/**
 * insert Ip
 */
export const insertIp = async (
  req,
  res,
  next,
) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    res.locals.ip = await db.ip.findOrCreate({
      where: {
        address: ip,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    t.afterCommit(() => {
      next();
    });
  });
};
