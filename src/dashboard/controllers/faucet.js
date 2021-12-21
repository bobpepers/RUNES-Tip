import db from '../../models';

export const fetchFaucetBalance = async (req, res, next) => {
  try {
    const faucet = await db.faucet.findOne();
    res.locals.balance = faucet.amount;
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
