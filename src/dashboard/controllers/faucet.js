import db from '../../models';

export const fetchFaucetBalance = async (
  req,
  res,
  next,
) => {
  const faucet = await db.faucet.findOne();
  res.locals.name = 'faucet';
  res.locals.result = {
    amount: faucet.amount,
  };
  next();
};
