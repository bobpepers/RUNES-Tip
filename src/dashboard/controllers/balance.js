import getCoinSettings from '../../config/settings';
import { getInstance } from '../../services/rclient';

const settings = getCoinSettings();

export const fetchBalance = async (
  req,
  res,
  next,
) => {
  let response;
  res.locals.name = 'balance';
  if (settings.coin.setting === 'Runebase') {
    response = await getInstance().getWalletInfo();
    res.locals.result = {
      amount: response.balance,
    };
  } else if (settings.coin.setting === 'Pirate') {
    response = await getInstance().zGetBalances();
    res.locals.result = {
      amount: response.reduce((n, { balance }) => n + balance, 0),
    };
  } else {
    response = await getInstance().getWalletInfo();
    res.locals.result = {
      amount: response.balance,
    };
  }
  next();
};
