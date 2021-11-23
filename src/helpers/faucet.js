import db from '../models';

export const createFaucet = async () => {
  const faucet = await db.faucet.findOne();
  if (!faucet) {
    await db.faucet.create({
      amount: 0,
      totalAmountClaimed: 0,
      claims: 0,
    });
  }
};
