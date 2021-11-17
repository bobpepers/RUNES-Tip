import bcrypt from 'bcrypt-nodejs';
import { sendResetPassword } from '../helpers/email';
import { tokenForUser } from '../helpers/token';
import { generateVerificationToken } from '../helpers/generate';
import timingSafeEqual from '../helpers/timingSafeEqual';

import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Reset password
 */
export const resetPassword = (req, res, next) => {
  const { email } = req.body;
  db.user.findOne({
    where: {
      [Op.or]: [
        { email },
      ],
    },
  }).then(async (user) => {
    if (!user) {
      return res.status(422).send({ error: "email doesn't exists" });
    }
    const verificationToken = await generateVerificationToken(1);
    user.update({
      resetpassexpires: verificationToken.expires,
      resetpasstoken: verificationToken.token,
      resetpassused: false,
    }).then((updatedUser) => {
      sendResetPassword(email, updatedUser.firstname, updatedUser.resetpasstoken);
      res.json({ success: true });
    }).catch((err) => {
      next(err);
    });
  }).catch((err) => next(err));
};

/**
 * Verify reset password
 */
export const verifyResetPassword = (req, res, next) => {
  const { email, token } = req.body;

  db.user.findOne({
    where: {
      [Op.or]: [
        { email },
      ],
    },
  }).then(async (user) => {
    if (!user) {
      return res.status(422).send({ error: { message: "email doesn't exists", resend: false } });
    }

    if (user.resetpassused) {
      console.log('already used resetpass token1');
      return res.status(422).send({ error: { message: "link already used, please request reset password again", resend: true } });
    }

    if (new Date() > user.resetpassexpires) {
      return res.status(422).send({ error: { message: "link already expired, please request reset password again", resend: true } });
    }
    console.log('timingSafeEqual(token, user.resetpasstoken)');
    console.log(token);
    console.log(user.resetpasstoken);
    console.log(timingSafeEqual(token, user.resetpasstoken));

    if (!timingSafeEqual(token, user.resetpasstoken)) {
      return res.status(422).send({ error: { message: "something has gone wrong, please request reset password again", resend: true } });
    }

    res.json({ success: true });
  }).catch((err) => {
    next(err);
  });
};

/**
 * Reset password, new password
 */
export const resetPasswordNew = (req, res, next) => {
  const { email, newpassword, token } = req.body;

  db.user.findOne({
    where: {
      [Op.or]: [
        { email },
      ],
    },
  }).then(async (user) => {
    if (!user) {
      return res.status(422).send({ error: { message: "email doesn't exists", resend: false } });
    }

    if (user.resetpassused) {
      console.log('already used resetpass token');
      return res.status(422).send({ error: { message: "link already used, please request reset password again", resend: true } });
    }

    if (new Date() > user.resetpassexpires) {
      return res.status(422).send({ error: { message: "link already expired, please request reset password again", resend: true } });
    }

    if (!timingSafeEqual(token, user.resetpasstoken)) {
      return res.status(422).send({ error: { message: "something has gone wrong, please request reset password again", resend: true } });
    }

    bcrypt.genSalt(10, (err, salt) => {
      console.log(salt);
      if (err) { return next(err); }

      bcrypt.hash(newpassword, salt, null, (err, hash) => {
        if (err) { return next(err); }

        user.update({
          password: hash,
          resetpassused: true,
        }).then((updatedUser) => {
          console.log(updatedUser);
          console.log('done updating user');
          const { firstname, lastname, email } = updatedUser;
          res.json({
            firstname, lastname, email,
          });
        }).catch((err) => {
          next(err);
        });
      });
    });
  }).catch((err) => {
    next(err);
  });
};
