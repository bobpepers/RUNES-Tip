import db from '../models';

export const initDatabaseRecords = async (
  discordClient,
  telegramClient,
) => {
  // Create Bot user for tagging
  const discordBotUser = await db.user.findOne({
    where: {
      user_id: `discord-${discordClient.user.id}`,
    },
  });
  if (!discordBotUser) {
    await db.user.create({
      username: discordClient.user.username,
      user_id: `discord-${discordClient.user.id}`,
    });
  }
  // Discord bot setting
  const discordBotSetting = await db.bots.findOne({
    where: {
      name: 'discord',
    },
  });
  if (!discordBotSetting) {
    await db.bots.create({
      name: 'discord',
    });
  }

  // Telegram bot setting
  const telegramBotSetting = await db.bots.findOne({
    where: {
      name: 'telegram',
    },
  });
  if (!telegramBotSetting) {
    await db.bots.create({
      name: 'telegram',
    });
  }

  // Matrix bot setting
  const matrixBotSetting = await db.bots.findOne({
    where: {
      name: 'matrix',
    },
  });
  if (!matrixBotSetting) {
    await db.bots.create({
      name: 'matrix',
    });
  }

  // Flood
  const autoWithdrawalSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'autoWithdrawal',
    },
  });
  if (!autoWithdrawalSetting) {
    await db.features.create({
      type: 'global',
      name: 'autoWithdrawal',
      enabled: true,
    });
  }
  // Init faucet Record
  const faucet = await db.faucet.findOne();
  if (!faucet) {
    await db.faucet.create({
      amount: 0,
      totalAmountClaimed: 0,
      claims: 0,
    });
  }

  // Init Features settings
  // Flood
  const triviaSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'trivia',
    },
  });
  if (!triviaSetting) {
    await db.features.create({
      type: 'global',
      name: 'trivia',
      enabled: true,
    });
  }
  // Flood
  const floodSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'flood',
    },
  });
  if (!floodSetting) {
    await db.features.create({
      type: 'global',
      name: 'flood',
      enabled: true,
    });
  }

  // Withdraw
  const withdrawSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'withdraw',
    },
  });
  if (!withdrawSetting) {
    await db.features.create({
      type: 'global',
      name: 'withdraw',
      enabled: true,
    });
  }

  // Tip
  const tipSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'tip',
    },
  });
  if (!tipSetting) {
    await db.features.create({
      type: 'global',
      name: 'tip',
      enabled: true,
    });
  }

  // Rain
  const rainSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'rain',
    },
  });
  if (!rainSetting) {
    await db.features.create({
      type: 'global',
      name: 'rain',
      enabled: true,
    });
  }

  // soak
  const soakSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'soak',
    },
  });
  if (!soakSetting) {
    await db.features.create({
      type: 'global',
      name: 'soak',
      enabled: true,
    });
  }

  // sleet
  const sleetSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'sleet',
    },
  });
  if (!sleetSetting) {
    await db.features.create({
      type: 'global',
      name: 'sleet',
      enabled: true,
    });
  }

  // voicerain
  const voicerainSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'voicerain',
    },
  });
  if (!voicerainSetting) {
    await db.features.create({
      type: 'global',
      name: 'voicerain',
      enabled: true,
    });
  }

  // Thunder
  const thunderSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'thunder',
    },
  });
  if (!thunderSetting) {
    await db.features.create({
      type: 'global',
      name: 'thunder',
      enabled: true,
    });
  }

  // Thunderstorm
  const thunderstormSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'thunderstorm',
    },
  });
  if (!thunderstormSetting) {
    await db.features.create({
      type: 'global',
      name: 'thunderstorm',
      enabled: true,
    });
  }

  // hurricane
  const hurricaneSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'hurricane',
    },
  });
  if (!hurricaneSetting) {
    await db.features.create({
      type: 'global',
      name: 'hurricane',
      enabled: true,
    });
  }

  // Faucet
  const faucetSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'faucet',
    },
  });
  if (!faucetSetting) {
    await db.features.create({
      type: 'global',
      name: 'faucet',
      enabled: true,
    });
  }

  // Reactdrop
  const reactdropSetting = await db.features.findOne({
    where: {
      type: 'global',
      name: 'reactdrop',
    },
  });
  if (!reactdropSetting) {
    await db.features.create({
      type: 'global',
      name: 'reactdrop',
      enabled: true,
    });
  }
};
