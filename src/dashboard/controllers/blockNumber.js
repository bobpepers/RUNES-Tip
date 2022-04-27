import db from '../../models';
import getCoinSettings from '../../config/settings';
import { getInstance } from '../../services/rclient';

const settings = getCoinSettings();

export const fetchBlockNumber = async (
  req,
  res,
  next,
) => {
  let response;
  if (settings.coin.setting === 'Runebase') {
    response = await getInstance().getBlockCount();
    // res.locals.blockNumberNode = response;
  } else if (settings.coin.setting === 'Pirate') {
    response = await getInstance().getBlockCount();
    // res.locals.blockNumberNode = response;
  } else if (settings.coin.setting === 'Dust') {
    response = await getInstance().getBlockCount();
    // res.locals.blockNumberNode = response;
  } else {
    response = await getInstance().getBlockCount();
    // res.locals.blockNumberNode = response;
  }

  const dbBlockNumber = await db.block.findOne({
    order: [['id', 'DESC']],
  });

  // res.locals.blockNumberDb = dbBlockNumber.id;
  res.locals.name = 'blockNumber';
  res.locals.result = {
    blockNumberNode: response,
    blockNumberDb: dbBlockNumber.id,
  };
  next();
};
