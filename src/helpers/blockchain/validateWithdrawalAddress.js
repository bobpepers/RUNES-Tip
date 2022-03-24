import db from '../../models';
import { getInstance } from '../../services/rclient';
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

export const validateWithdrawalAddress = async (
  address,
  user,
  t,
) => {
  let failWithdrawalActivity;
  let getAddressInfo;
  let isInvalidAddress = false;
  let isNodeOffline = false;
  let isValidAddress = false;

  // Regex check
  if (settings.coin.setting === 'Runebase') {
    isValidAddress = await getInstance().utils.isRunebaseAddress(address);
  } else if (settings.coin.setting === 'Pirate') {
    isValidAddress = await getInstance().utils.isPirateAddress(address);
  } else if (settings.coin.setting === 'Komodo') {
    isValidAddress = await getInstance().utils.isKomodoAddress(address);
  } else {
    isValidAddress = await getInstance().utils.isRunebaseAddress(address);
  }

  if (!isValidAddress) {
    console.log('failed regex address');
    isInvalidAddress = true;
  }

  // Check on Crypto node
  if (settings.coin.setting === 'Runebase') {
    try {
      getAddressInfo = await getInstance().getAddressInfo(address);
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 500) {
        isInvalidAddress = true;
        // return;
      } else {
        isNodeOffline = true;
      }
    }
  } else if (settings.coin.setting === 'Pirate') {
    getAddressInfo = true;
  } else if (settings.coin.setting === 'Komodo') {
    getAddressInfo = true;
  }

  if (!getAddressInfo) {
    console.log('fail node check');
    isInvalidAddress = true;
  }

  if (isInvalidAddress || isNodeOffline) {
    failWithdrawalActivity = await db.activity.create({
      type: `withdraw_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
  }

  return [
    isInvalidAddress,
    isNodeOffline,
    failWithdrawalActivity,
  ];
};
