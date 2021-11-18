// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const fetchDashboardUsers = async (req, res, next) => {
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
    if (req.body.role !== 'all') {
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
        where: userOptions,
    };
    res.locals.dashboardusers = await db.dashboardUser.findAll(options);
    console.log(res.locals.dashboardusers);
    next();
};
