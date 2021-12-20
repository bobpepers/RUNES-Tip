import db from '../../models';

export const waterFaucet = async (
  t,
  fee,
  faucetSetting,
) => {
  const addAmount = Number(((fee / 100) * (faucetSetting.fee / 1e2)).toFixed(0));
  const faucet = await db.faucet.findOne({
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  await faucet.update({
    amount: faucet.amount + addAmount,
  }, {
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  await db.activity.create({
    type: 'waterFaucet',
    amount: addAmount,
    earner_balance: faucet.amount + addAmount,
  }, {
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
};
