import db from '../models';

export const initDatabaseRecords = async () => {
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
