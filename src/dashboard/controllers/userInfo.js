import { Sequelize } from 'sequelize';
import db from '../../models';

export const fetchUserInfo = async (
  req,
  res,
  next,
) => {
  res.locals.name = 'user';
  res.locals.result = await db.user.findOne({
    where: {
      id: req.body.id,
    },
    attributes: {
      include: [
        [Sequelize.fn('sum', Sequelize.literal("CASE WHEN reactdroptips.status = 'success' THEN 1 ELSE 0 END")), 'reactdrop_success_count'],
        [Sequelize.fn('sum', Sequelize.literal("CASE WHEN reactdroptips.status = 'failed' THEN 1 ELSE 0 END")), 'reactdrop_failed_count'],
      ],
    },
    group: ['wallet.id'],
    include: [
      {
        model: db.wallet,
        as: 'wallet',
      },
      {
        model: db.reactdroptip,
        as: 'reactdroptips',
        attributes: [],
      },
    ],
  });
  console.log(res.locals.result);
  next();
};
