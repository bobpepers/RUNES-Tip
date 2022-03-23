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
  let userId;
  if (
    ctx
    && ctx.update
    && ctx.update.message
    && ctx.update.message.from
    && ctx.update.message.from.id
  ) {
    userId = ctx.update.message.from.id;
  }
  if (
    ctx
    && ctx.update
    && ctx.update.callback_query
    && ctx.update.callback_query.from
    && ctx.update.callback_query.from.id
  ) {
    userId = ctx.update.callback_query.from.id;
  }
  console.log(ctx.update.message);
  const user = await db.user.findOne({
    where: {
      user_id: `telegram-${userId}`,
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
    await ctx.reply(userNotFoundMessage());
  }
  return [
    user,
    activity,
  ];
};
