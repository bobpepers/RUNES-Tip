import getCoinSettings from '../../config/settings';
import { getInstance } from '../../services/rclient';

const settings = getCoinSettings();

export const fetchBalance = async (
  req,
  res,
  next,
) => {
  try {
    let response;
    if (settings.coin.setting === 'Runebase') {
      response = await getInstance().getWalletInfo();
      res.locals.balance = response.balance;
    } else if (settings.coin.setting === 'Pirate') {
      response = await getInstance().zGetBalances();
      res.locals.balance = response.reduce((n, { balance }) => n + balance, 0);
    } else {
      response = await getInstance().getWalletInfo();
      res.locals.balance = response.balance;
    }
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
