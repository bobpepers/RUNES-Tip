import {
  Transaction,
  Op,
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
    console.log('user is banned');
    req.logOut();
    req.session.destroy();
    res.status(401).send({
      error: 'USER_BANNED',
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
  if (req.authErr === 'USER_NOT_EXIST') {
    return next('USER_NOT_EXIST', false);
  }
  // console.log(req.authErr);
  if (req.authErr === 'EMAIL_NOT_VERIFIED') {
    console.log('EMAIL_NOT_VERIFIED');
    const email = req.user_email;
    res.locals.email = req.user_email;
    db.dashboardUser.findOne({
      where: {
        [Op.or]: [
          {
            email: email.toLowerCase(),
          },
        ],
      },
    }).then(async (user) => {
      const verificationToken = await generateVerificationToken(24);
      if (user.authused === true) {
        return next(req.authErr, false);
      }
      user.update({
        authexpires: verificationToken.tomorrow,
        authtoken: verificationToken.authtoken,
      }).then((updatedUser) => {
        const {
          email,
          authtoken,
        } = updatedUser;
        sendVerificationEmail(email, authtoken);
        console.log('EMAIL_SENT');
        return next(req.authErr, false);
      }).catch((err) => next(err, false));
    }).catch((err) => next(err, false));
  } else {
    // const activity = await db.activity.create({
    //  earnerId: req.user.id,
    //  type: 'login',
    //  ipId: res.locals.ip[0].id,
    // });
    // res.locals.activity = await db.activity.findOne({
    //  where: {
    //    id: activity.id,
    //  },
    //  attributes: [
    //    'createdAt',
    //    'type',
    //  ],
    // include: [
    //   {
    //     model: db.user,
    //    as: 'earner',
    //      required: false,
    //     attributes: ['username'],
    //   },
    // ],
    // });
    console.log(req.authErr);
    if (req.authErr === 'EMAIL_NOT_VERIFIED') {
      console.log('EMAIL_NOT_VERIFIED');
      req.session.destroy();
      res.status(401).send({
        error: req.authErr,
        email: res.locals.email,
      });
    } else if (req.authErr) {
      console.log('LOGIN_ERROR');
      req.session.destroy();
      res.status(401).send({
        error: 'LOGIN_ERROR',
      });
    } else {
      res.json({
        username: req.user.username,
      });
    }
  }
};

export const destroySession = async (
  req,
  res,
  next,
) => {
  // const activity = await db.activity.create(
  //   {
  //     earnerId: req.user.id,
  //     type: 'logout',
  //     ipId: res.locals.ip[0].id,
  //   },
  // );
  // res.locals.activity = await db.activity.findOne({
  //   where: {
  //     id: activity.id,
  //   },
  //   attributes: [
  //     'createdAt',
  //     'type',
  //   ],
  //   include: [
  //     {
  //       model: db.user,
  //       as: 'earner',
  //       required: false,
  //       attributes: ['username'],
  //     },
  //   ],
  // });
  req.logOut();
  req.session.destroy();
  next();
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
    return res.status(422).send({ error: "all fields are required" });
  }

  const textCharacters = new RegExp("^[a-zA-Z0-9]*$");
  if (!textCharacters.test(username)) {
    return res.status(401).send({
      error: 'USERNAME_NO_SPACES_OR_SPECIAL_CHARACTERS_ALLOWED',
    });
  }

  const User = await db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        {
          username,
        },
        {
          email: email.toLowerCase(),
        },
      ],
    },
  });

  if (User && User.username.toLowerCase() === username.toLowerCase()) {
    return res.status(401).send({
      error: 'USERNAME_ALREADY_EXIST',
    });
  }
  if (User && User.email.toLowerCase() === email.toLowerCase()) {
    return res.status(401).send({
      error: 'EMAIL_ALREADY_EXIST',
    });
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const verificationToken = await generateVerificationToken(24);
    const newUser = await db.dashboardUser.create({
      username,
      password,
      email: email.toLowerCase(),
      authused: false,
      authexpires: verificationToken.expires,
      authtoken: verificationToken.token,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    t.afterCommit(() => {
      sendVerificationEmail(email.toLowerCase(), newUser.authtoken);
      return res.json({
        email: email.toLowerCase(),
      });
      // next();
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
  console.log('resend verification');
  const { email } = req.body;
  db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        {
          email: email.toLowerCase(),
        },
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
      const { email, authtoken } = updatedUser;
      sendVerificationEmail(email.toLowerCase(), authtoken);
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
  const { email, token } = req.body;

  db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        {
          email: email.toLowerCase(),
        },
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
