// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const fetchDeposits = async (req, res, next) => {
    console.log(req.body);
    const transactionOptions = {
        type: 'receive',
    };
    const userOptions = {};

    if (req.body.id !== '') {
        transactionOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
    }
    if (req.body.txId !== '') {
        transactionOptions.txid = { [Op.like]: `%${req.body.txId}%` };
    }
    if (req.body.from !== '') {
        transactionOptions.to_from = { [Op.like]: `%${req.body.from}%` };
    }
    if (req.body.userId !== '') {
        userOptions.userId = { [Op.like]: `%${req.body.userId}%` };
    }
    if (req.body.username !== '') {
        userOptions.username = { [Op.like]: `%${req.body.username}%` };
    }

    const options = {
        where: transactionOptions,
        include: [
            {
                model: db.address,
                as: 'address',
                include: [
                    {
                        model: db.wallet,
                        as: 'wallet',
                        include: [
                            {
                                model: db.user,
                                as: 'user',
                                where: userOptions,
                            },
                        ],
                    },
                ],
            },
        ],
    };
    res.locals.deposits = await db.transaction.findAll(options);
    console.log(res.locals.deposits);
    next();
};
