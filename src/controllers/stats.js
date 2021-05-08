import db from '../models';
/**
 * Fetch Stats
 */
export const stats = async (req, res, next) => {
  try {
    const lastStats = await db.stats.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
    console.log('lastStats');
    console.log(lastStats);
    res.json(lastStats);
    return lastStats;
  } catch (err) {
    console.log(`err${err}`);
    res.status(500).send(err);
  }
};
