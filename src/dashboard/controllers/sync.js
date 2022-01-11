import getCoinSettings from '../../config/settings';
import { startKomodoSync } from "../../services/syncKomodo";
import { startRunebaseSync } from "../../services/syncRunebase";
import { startPirateSync } from "../../services/syncPirate";

const settings = getCoinSettings();

export const startSyncBlocks = async (
  req,
  res,
  next,
) => {
  try {
    let response;
    if (settings.coin.setting === 'Runebase') {
      startRunebaseSync();
    } else if (settings.coin.setting === 'Pirate') {
      startPirateSync();
    } else if (settings.coin.setting === 'Dust') {
      startKomodoSync();
    } else {
      startRunebaseSync();
    }

    res.locals.sync = 'TRUE';
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
