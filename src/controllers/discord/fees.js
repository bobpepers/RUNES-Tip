import {
  DiscordFeeMessage,
} from '../../messages/discord';
import db from '../../models';

export const findFee = async (
  name,
  groupId,
  channelId,
) => {
  let fee;

  fee = await db.features.findOne({
    where: {
      type: 'local',
      name,
      groupId,
      channelId,
    },
  });
  if (!fee) {
    fee = await db.features.findOne({
      where: {
        type: 'local',
        name,
        groupId,
      },
    });
  }
  if (!fee) {
    fee = await db.features.findOne({
      where: {
        type: 'global',
        name,
      },
    });
  }
  return fee;
};

export const fetchFeeSchedule = async (
  message,
  io,
  guildId = null,
  channelId = null,
) => {
  const fee = {};
  const activity = [];
  const user = await db.user.findOne({
    where: {
      user_id: `discord-${message.author.id}`,
    },
  });

  if (!user) {
    const preActivityFail = await db.activity.create({
      type: 'fees_f',
      earnerId: user.id,
    });
    const finalActivityFail = await db.activity.findOne({
      where: {
        id: preActivityFail.id,
      },
      include: [
        {
          model: db.user,
          as: 'earner',
        },
      ],
    });
    activity.unshift(finalActivityFail);
    await message.author.send("User not found!");
  }

  fee.tip = await findFee(
    'tip',
    guildId,
    channelId,
  );

  fee.reactdrop = await findFee(
    'reactdrop',
    guildId,
    channelId,
  );

  fee.soak = await findFee(
    'soak',
    guildId,
    channelId,
  );

  fee.rain = await findFee(
    'rain',
    guildId,
    channelId,
  );

  fee.voicerain = await findFee(
    'voicerain',
    guildId,
    channelId,
  );
  fee.thunder = await findFee(
    'thunder',
    guildId,
    channelId,
  );
  fee.thunderstorm = await findFee(
    'thunderstorm',
    guildId,
    channelId,
  );
  fee.hurricane = await findFee(
    'hurricane',
    guildId,
    channelId,
  );
  fee.flood = await findFee(
    'flood',
    guildId,
    channelId,
  );
  fee.sleet = await findFee(
    'sleet',
    guildId,
    channelId,
  );
  fee.withdraw = await findFee(
    'withdraw',
    guildId,
    channelId,
  );
  console.log(fee);
  const preActivity = await db.activity.create({
    type: 'fees_s',
    earnerId: user.id,
  });
  const finalActivity = await db.activity.findOne({
    where: {
      id: preActivity.id,
    },
    include: [
      {
        model: db.user,
        as: 'earner',
      },
    ],
  });
  activity.unshift(finalActivity);

  await message.reply({
    embeds: [
      DiscordFeeMessage(
        message,
        fee,
      ),
    ],
  });

  io.to('admin').emit('updateActivity', {
    activity,
  });
};
