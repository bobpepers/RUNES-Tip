import bcrypt from 'bcrypt-nodejs';
import {
  Op,
} from 'sequelize';
import { sendResetPassword } from '../helpers/email';
import { generateVerificationToken } from '../helpers/generate';
import timingSafeEqual from '../helpers/timingSafeEqual';
import db from '../../models';

/**
 * Reset password
 */
export const resetPassword = async (req, res, next) => {
  console.log('resetPassword');
  const { email } = req.body;
  const user = await db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        { email },
      ],
    },
  });
  if (!user) {
    throw new Error("email doesn't exists");
  }
  if (user) {
    const verificationToken = await generateVerificationToken(1);
    const updatedUser = await user.update({
      resetpassexpires: verificationToken.expires,
      resetpasstoken: verificationToken.token,
      resetpassused: false,
    });
    const successSend = await sendResetPassword(
      email,
      updatedUser.username,
      updatedUser.resetpasstoken,
    );
    if (!successSend) {
      throw new Error("Failed to send email");
    }
    res.locals.result = {
      success: true,
    };
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
    throw new Error("email doesn't exists");
  }
  if (user) {
    if (user.resetpassused) {
      throw new Error("link already used, please request reset password again");
    }
    if (new Date() > user.resetpassexpires) {
      throw new Error("link already expired, please request reset password again");
    }
    if (!timingSafeEqual(token, user.resetpasstoken)) {
      throw new Error("something has gone wrong, please request reset password again");
    }
    res.locals.result = {
      success: true,
    };
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
    throw new Error("email doesn't exists");
  }
  if (user) {
    if (user.resetpassused) {
      throw new Error("link already used, please request reset password again");
    }
    if (new Date() > user.resetpassexpires) {
      throw new Error("link already expired, please request reset password again");
    }
    if (!timingSafeEqual(token, user.resetpasstoken)) {
      throw new Error("something has gone wrong, please request reset password again");
    }
    bcrypt.genSalt(10, (err, salt) => {
      console.log(salt);
      if (err) {
        throw new Error(err);
      }

      bcrypt.hash(newpassword, salt, null, (err, hash) => {
        if (err) {
          throw new Error(err);
        }

        user.update({
          password: hash,
          resetpassused: true,
        }).then((updatedUser) => {
          const {
            username,
            email,
          } = updatedUser;
            // res.locals.username = username;
            // res.locals.email = email;
          res.locals.result = {
            username,
            email,
          };
          next();
        }).catch((err) => {
          throw new Error(err);
        });
      });
    });
  }
};
