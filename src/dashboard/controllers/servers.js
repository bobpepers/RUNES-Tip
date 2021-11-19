// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const fetchServers = async (req, res, next) => {
    const userOptions = {};
    if (req.body.platform !== 'all') {
        if (req.body.platform === 'telegram') {
            userOptions.groupId = { [Op.startsWith]: 'telegram-' };
        }
        if (req.body.platform === 'discord') {
            userOptions.groupId = { [Op.startsWith]: 'discord-' };
        }
    }
    if (req.body.id !== '') {
        userOptions.id = Number(req.body.id);
    }
    if (req.body.groupId !== '') {
        userOptions.groupId = req.body.groupId;
    }

    const options = {
        where: userOptions,
    };
    res.locals.servers = await db.group.findAll(options);
    next();
};