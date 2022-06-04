import {
  Transaction,
  Op,
  Sequelize,
} from 'sequelize';
import { sendVerificationEmail } from '../helpers/email';
import db from '../../models';
import { generateVerificationToken } from '../helpers/generate';
import timingSafeEqual from '../helpers/timingSafeEqual';

/**
 * Is Dashboard User Banned?
 */
export const isDashboardUserBanned = async (
  req,
  res,
  next,
) => {
  if (req.user.banned) {
    req.session.destroy((err) => {
      res.status(401).send({
        error: 'USER_BANNED',
      });
    });
  } else {
    next();
  }
};

/**
 * Sign in
 */
export const signin = async (
  req,
  res,
  next,
) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const activity = await db.activity.create({
    dashboardUserId: req.user.id,
    type: 'login_s',
    //  ipId: res.locals.ip[0].id,
  });
  res.locals.activity = await db.activity.findOne({
    where: {
      id: activity.id,
    },
    attributes: [
      'createdAt',
      'type',
    ],
    include: [
      {
        model: db.dashboardUser,
        as: 'dashboardUser',
        required: false,
        attributes: ['username'],
      },
    ],
  });
  res.locals.result = req.user.username;

  return next();
};

export const destroySession = async (
  req,
  res,
  next,
) => {
  const activity = await db.activity.create(
    {
      dashboardUserId: req.user.id,
      type: 'logout_s',
      //     ipId: res.locals.ip[0].id,
    },
  );
  res.locals.activity = await db.activity.findOne({
    where: {
      id: activity.id,
    },
    attributes: [
      'createdAt',
      'type',
    ],
    include: [
      {
        model: db.dashboardUser,
        as: 'dashboardUser',
        required: false,
        attributes: ['username'],
      },
    ],
  });
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

/**
 * Sign up
 */
export const signup = async (req, res, next) => {
  const {
    email,
    password,
    username,
  } = req.body.props;

  if (!email || !password || !username) {
    throw new Error("all fields are required");
    // return res.status(422).send({ error: "all fields are required" });
  }

  const textCharacters = new RegExp("^[a-zA-Z0-9]*$");
  if (!textCharacters.test(username)) {
    throw new Error("USERNAME_NO_SPACES_OR_SPECIAL_CHARACTERS_ALLOWED");
  }

  const user = await db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')), Sequelize.fn('lower', username)),
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), Sequelize.fn('lower', email)),
      ],
    },
  });

  const isUserNameEqual = user && user.username.localeCompare(username, undefined, { sensitivity: 'accent' });
  const isEmailEqual = user && user.email.localeCompare(email, undefined, { sensitivity: 'accent' });

  if (isUserNameEqual === 0) {
    throw new Error("USERNAME_ALREADY_EXIST");
  }
  if (isEmailEqual === 0) {
    throw new Error("EMAIL_ALREADY_EXIST");
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const verificationToken = await generateVerificationToken(24);
    const newUser = await db.dashboardUser.create({
      username,
      password,
      email,
      authused: false,
      authexpires: verificationToken.expires,
      authtoken: verificationToken.token,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    t.afterCommit(() => {
      sendVerificationEmail(email, newUser.authtoken);
      return res.json({
        email,
      });
    });
  });
};

/**
 * Resend verification code
 */
export const resendVerification = async (
  req,
  res,
  next,
) => {
  const {
    email,
  } = req.body;

  db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), Sequelize.fn('lower', email)),
      ],
    },
  }).then(async (user) => {
    const verificationToken = await generateVerificationToken(24);
    if (user.authused === true) {
      res.json({ success: false });
      return next('Auth Already Used');
    }
    user.update({
      authexpires: verificationToken.expires,
      authtoken: verificationToken.token,
    }).then((updatedUser) => {
      const {
        email,
        authtoken,
      } = updatedUser;
      sendVerificationEmail(email, authtoken);
      res.json({ success: true });
    }).catch((err) => {
      next(err);
    });
  }).catch((err) => {
    next(err);
  });
};

/**
 * Verify email
 */
export const verifyEmail = (
  req,
  res,
  next,
) => {
  const {
    email,
    token,
  } = req.body;

  db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), Sequelize.fn('lower', email)),
      ],
    },
  }).then((user) => {
    if (!user) {
      throw new Error('USER_NOT_EXIST');
    }
    if (user.authused > 0) {
      throw new Error('AUTH_TOKEN_ALREADY_USED');
    }
    if (new Date() > user.authexpires) {
      throw new Error('AUTH_TOKEN_EXPIRED');
    }
    if (!timingSafeEqual(token, user.authtoken)) {
      throw new Error('INCORRECT_TOKEN');
    }
    user.update({
      authused: true,
      role: 1,
    }).then(async (updatedUser) => {
      res.locals.user = updatedUser;
      next();
    }).catch((err) => {
      res.locals.error = err.message;
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};
