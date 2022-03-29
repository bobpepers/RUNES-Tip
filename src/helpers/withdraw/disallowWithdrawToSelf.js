import db from "../../models";

export const disallowWithdrawToSelf = async (
  address,
  user,
  t,
) => {
  let failWithdrawalActivity;
  const isMyAddress = await db.address.findOne({
    where: {
      walletId: user.wallet.id,
      address,
    },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  if (isMyAddress) {
    failWithdrawalActivity = await db.activity.create({
      type: `withdraw_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
  }
  return failWithdrawalActivity;
};
