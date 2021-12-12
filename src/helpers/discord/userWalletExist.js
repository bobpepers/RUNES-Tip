import db from '../../models';
import {
  walletNotFoundMessage,
} from '../../messages/discord';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const userWalletExist = async (
  message,
  t,
  functionName,
) => {
  let activity;
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
    include: [
      {
        model: db.wallet,
        as: 'wallet',
        required: true,
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
    await message.channel.send({ embeds: [walletNotFoundMessage(message, capitalize(functionName))] });
  }
  return [
    user,
    activity,
  ];
};
