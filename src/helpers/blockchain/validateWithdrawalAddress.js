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

  if (settings.coin.setting === 'Runebase') {
    try {
      getAddressInfo = await getInstance().validateAddress(address);
      console.log(getAddressInfo);
      if (getAddressInfo && !getAddressInfo.isvalid) {
        isInvalidAddress = true;
      }
      if (getAddressInfo && getAddressInfo.isvalid) {
        isInvalidAddress = false;
      }
    } catch (e) {
      isNodeOffline = true;
    }
  } else if (settings.coin.setting === 'Pirate') {
    try {
      getAddressInfo = await getInstance().zValidateAddress(address);
      if (getAddressInfo && !getAddressInfo.isvalid) {
        isInvalidAddress = true;
      }
      if (getAddressInfo && getAddressInfo.isvalid) {
        isInvalidAddress = false;
      }
    } catch (e) {
      isNodeOffline = true;
    }
  } else if (settings.coin.setting === 'Komodo') {
    try {
      getAddressInfo = await getInstance().validateAddress(address);
      console.log(getAddressInfo);
      if (getAddressInfo && !getAddressInfo.isvalid) {
        isInvalidAddress = true;
      }
      if (getAddressInfo && getAddressInfo.isvalid) {
        isInvalidAddress = false;
      }
    } catch (e) {
      isNodeOffline = true;
    }
  } else {
    try {
      getAddressInfo = await getInstance().validateAddress(address);
      console.log(getAddressInfo);
      if (getAddressInfo && !getAddressInfo.isvalid) {
        isInvalidAddress = true;
      }
      if (getAddressInfo && getAddressInfo.isvalid) {
        isInvalidAddress = false;
      }
    } catch (e) {
      isNodeOffline = true;
    }
  }

  if (!getAddressInfo) {
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
