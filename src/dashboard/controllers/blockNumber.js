import db from '../../models';
import getCoinSettings from '../../config/settings';

const { getInstance } = require('../../services/rclient');

const settings = getCoinSettings();

export const fetchBlockNumber = async (
  req,
  res,
  next,
) => {
  console.log('fetchBlockNumber');
  console.log('fetchBlockNumber');
  console.log('fetchBlockNumber');
  console.log('fetchBlockNumber');
  console.log('fetchBlockNumber');

  try {
    let response;
    if (settings.coin.setting === 'Runebase') {
      response = await getInstance().getBlockCount();
      console.log(response);
      res.locals.blockNumberNode = response;
    } else if (settings.coin.setting === 'Pirate') {
      response = await getInstance().getBlockCount();
      console.log(response);
      res.locals.blockNumberNode = response;
    } else if (settings.coin.setting === 'Dust') {
      response = await getInstance().getBlockCount();
      console.log(response);
      res.locals.blockNumberNode = response;
    } else {
      response = await getInstance().getBlockCount();
      res.locals.blockNumberNode = response;
    }

    const dbBlockNumber = await db.block.findOne({
      order: [['id', 'DESC']],
    });
    res.locals.blockNumberDb = dbBlockNumber.id;
    console.log(dbBlockNumber);

    // console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
