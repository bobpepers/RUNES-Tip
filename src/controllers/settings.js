import db from '../models';

export const waterFaucetSettings = async (
  groupId = null,
  channelId = null,
  t = null,
) => {
  let setting;
  setting = await db.features.findOne({
    where: {
      type: 'local',
      name: 'faucet',
      groupId,
      channelId,
    },
    ...(
      t && {
        lock: t.LOCK.UPDATE,
        transaction: t,
      }
    ),
  });
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'local',
        name: 'faucet',
        groupId,
        channelId: null,
      },
      ...(
        t && {
          lock: t.LOCK.UPDATE,
          transaction: t,
        }
      ),
    });
  }
  if (!setting) {
    setting = await db.features.findOne({
      where: {
        type: 'global',
        name: 'faucet',
      },
      ...(
        t && {
          lock: t.LOCK.UPDATE,
          transaction: t,
        }
      ),
    });
  }

  console.log(setting);
  return setting;
};
