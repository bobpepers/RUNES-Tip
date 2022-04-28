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
  } else if (settings.coin.setting === 'Pirate') {
    response = await getInstance().getBlockCount();
  } else if (settings.coin.setting === 'Dust') {
    response = await getInstance().getBlockCount();
  } else {
    response = await getInstance().getBlockCount();
  }

  const dbBlockNumber = await db.block.findOne({
    order: [['id', 'DESC']],
  });s

  res.locals.name = 'blockNumber';
  res.locals.result = {
    blockNumberNode: response,
    blockNumberDb: dbBlockNumber.id,
  };
  next();
};
