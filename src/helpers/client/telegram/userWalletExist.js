import db from '../../../models';
import {
  userNotFoundMessage,
} from '../../../messages/telegram';

// const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const userWalletExist = async (
  ctx,
  t,
  functionName,
) => {
  let activity;
  console.log(ctx.update.message);
  const user = await db.user.findOne({
    where: {
      user_id: `telegram-${ctx.update.message.from.id}`,
    },
    include: [
      {
        model: db.wallet,
        as: 'wallet',
        include: [
          {
            model: db.address,
            as: 'addresses',
            required: true,
          },
        ],
      },
    ],
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (!user) {
    activity = await db.activity.create({
      type: `${functionName}_f`,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    ctx.reply(userNotFoundMessage());
  }
  return [
    user,
    activity,
  ];
};
