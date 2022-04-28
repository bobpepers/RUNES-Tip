import { Op } from 'sequelize';
import db from '../../models';

export const fetchDashboardUsers = async (
  req,
  res,
  next,
) => {
  const userOptions = {};
  if (req.body.id !== '') {
    userOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
  }
  if (req.body.username !== '') {
    userOptions.username = { [Op.like]: `%${req.body.username}%` };
  }
  if (req.body.email !== '') {
    userOptions.email = { [Op.like]: `%${req.body.email}%` };
  }
  if (req.body.role !== 'All') {
    userOptions.role = req.body.role;
  }
  if (req.body.banned !== 'all') {
    if (req.body.banned === 'true') {
      userOptions.banned = true;
    }
    if (req.body.banned === 'false') {
      userOptions.banned = false;
    }
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    where: userOptions,
  };
  console.log(options);
  res.locals.name = 'dashboardUsers';
  res.locals.count = await db.dashboardUser.count(options);
  res.locals.result = await db.dashboardUser.findAll(options);
  console.log(res.locals.result);
  next();
};
