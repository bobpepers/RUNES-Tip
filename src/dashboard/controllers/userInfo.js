// import { Transaction } from 'sequelize';
import db from '../../models';

export const fetchUserInfo = async (
  req,
  res,
  next,
) => {
  res.locals.result = await db.user.findOne({
    where: {
      id: req.body.id,
    },
    include: [
      {
        model: db.wallet,
        as: 'wallet',
      },
    ],
  });
  res.locals.name = 'user';
  next();
};
