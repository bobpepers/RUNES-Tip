import db from '../models';

export const fetchUserCount = async (req, res, next) => {
  const count = await db.user.count({
    where: {
      authused: 1,
    },
  });
  console.log('count');
  console.log(count);
  res.json(count);
};
