import { Transaction } from 'sequelize';
import db from '../../models';

export const fetchUserInfo = async (
  req,
  res,
  next,
) => {
  res.locals.user = await db.user.findOne({
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
  console.log(res.locals.user);
  next();
};
