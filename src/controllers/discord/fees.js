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

  await message.reply({
    embeds: [
      DiscordFeeMessage(
        message,
        fee,
      ),
    ],
  });
  console.log(fee);
};
