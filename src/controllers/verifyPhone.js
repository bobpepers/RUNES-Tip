import db from '../models';

require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const { Sequelize, Transaction, Op } = require('sequelize');

export const getPhoneCode = async (req, res, next) => {
  console.log('123333');
  console.log(req.body.phonenumber);
  client
    .verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications
    .create({
      to: `+${req.body.phonenumber}`,
      channel: 'sms',
    })
    .then((data) => {
      console.log(data);
      res.locals.phonecode = data;
      next();
      // res.status(200).send(data);
    })
    .catch((e) => { console.error('Got an error:', e.code, e.message); });
};

export const verifyPhoneCode = async (req, res, next) => {
  client
    .verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks
    .create({
      to: `+${req.body.phoneNumber}`,
      code: req.body.verifyCode,
    })
    .then(async (data) => {
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        const user = await db.user.findOne({
          where: {
            id: req.user.id,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!user) {
          throw new Error('USER_NOT_FOUND');
        }
        console.log(data);
        const updatedUser = await user.update({
          phoneNumber: req.body.phoneNumber,
          phoneNumberVerified: true,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        res.locals.phoneNumber = updatedUser.phoneNumber;
        res.locals.phoneNumberVerified = updatedUser.phoneNumberVerified;
        res.locals.verifyphonecode = data;

        t.afterCommit(() => {
          next();
        });
      }).catch((err) => {
        res.locals.error = err.message;
        next();
      });

      // res.status(200).send(data);
    })
    .catch((e) => { console.error('Got an error:', e.code, e.message); });
};
