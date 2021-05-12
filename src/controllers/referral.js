import db from '../models';
import { getInstance } from '../services/rclient';

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const qr = require('qr-image');
const logger = require('../helpers/logger');

// eslint-disable-next-line import/prefer-default-export
export const createReferral = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(ctx);
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong with adding referral');
  });
};
