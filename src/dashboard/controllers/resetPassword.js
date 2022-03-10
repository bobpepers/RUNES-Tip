import bcrypt from 'bcrypt-nodejs';
import { sendResetPassword } from '../helpers/email';
// import { tokenForUser } from '../helpers/token';
import { generateVerificationToken } from '../helpers/generate';
import timingSafeEqual from '../helpers/timingSafeEqual';

import db from '../../models';

const {
  Sequelize,
  Transaction,
  Op,
} = require('sequelize');

/**
 * Reset password
 */
export const resetPassword = async (req, res, next) => {
  console.log(req.body);
  console.log("initiate reset password");
  try {
    const { email } = req.body;
    const user = await db.dashboardUser.findOne({
      where: {
        [Op.or]: [
          { email },
        ],
      },
    });
    if (!user) {
      res.locals.error = "email doesn't exists";
      return next();
      // return res.status(422).send({ error: "email doesn't exists" });
    }
    if (user) {
      const verificationToken = await generateVerificationToken(1);
      const updatedUser = await user.update({
        resetpassexpires: verificationToken.expires,
        resetpasstoken: verificationToken.token,
        resetpassused: false,
      });
      sendResetPassword(email, updatedUser.username, updatedUser.resetpasstoken);
      res.locals.resetPassword = true;
      return next();
    }
  } catch (e) {
    res.locals.error = e;
    return next();
  }
};

/**
 * Verify reset password
 */
export const verifyResetPassword = async (
  req,
  res,
  next,
) => {
  try {
    const {
      email,
      token,
    } = req.body;

    const user = await db.dashboardUser.findOne({
      where: {
        [Op.or]: [
          { email },
        ],
      },
    });

    if (!user) {
      res.locals.error = "email doesn't exists";
      return next();
    }
    if (user) {
      if (user.resetpassused) {
        res.locals.error = "link already used, please request reset password again";
        return next();
      }
      if (new Date() > user.resetpassexpires) {
        res.locals.error = "link already expired, please request reset password again";
        return next();
      }
      if (!timingSafeEqual(token, user.resetpasstoken)) {
        res.locals.error = "something has gone wrong, please request reset password again";
        return next();
      }
      res.locals.resetPasswordVerify = true;
      return next();
    }
  } catch (e) {
    res.locals.error = e;
    return next();
  }
};

/**
 * Reset password, new password
 */
export const resetPasswordNew = async (
  req,
  res,
  next,
) => {
  try {
    const {
      email,
      newpassword,
      token,
    } = req.body;

    const user = await db.dashboardUser.findOne({
      where: {
        [Op.or]: [
          { email },
        ],
      },
    });
    if (!user) {
      res.locals.error = "email doesn't exists";
      return next();
    }
    if (user) {
      if (user.resetpassused) {
        res.locals.error = "link already used, please request reset password again";
        return next();
      }
      if (new Date() > user.resetpassexpires) {
        res.locals.error = "link already expired, please request reset password again";
        return next();
      }
      if (!timingSafeEqual(token, user.resetpasstoken)) {
        res.locals.error = "something has gone wrong, please request reset password again";
        return next();
      }
      bcrypt.genSalt(10, (err, salt) => {
        console.log(salt);
        if (err) {
          res.locals.error = err;
          return next();
        }

        bcrypt.hash(newpassword, salt, null, (err, hash) => {
          if (err) {
            res.locals.error = err;
            return next();
          }

          user.update({
            password: hash,
            resetpassused: true,
          }).then((updatedUser) => {
            const {
              username,
              email,
            } = updatedUser;
            res.locals.username = username;
            res.locals.email = email;
            next();
          }).catch((err) => {
            next(err);
          });
        });
      });
    }
  } catch (e) {
    res.locals.error = e;
    return next();
  }
};
