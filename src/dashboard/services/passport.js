import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Op } from 'sequelize';
import { config } from "dotenv";
import db from '../../models';

import { sendVerificationEmail } from '../helpers/email';
import { generateVerificationToken } from '../helpers/generate';

// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { sendVerificationEmail } from '../helpers/email';

config();

const localOptions = {
  passReqToCallback: true,
  usernameField: 'email',
};

passport.serializeUser(async (user, done) => { // In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => { // Here you retrieve all the info of the user from the session storage using the user id stored in the session earlier using serialize user.
  db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        { id },
      ],
    },
  }).then((user) => {
    done(null, user);
  }).catch((error) => {
    done(error, null);
  });
});

const localLogin = new LocalStrategy(localOptions, async (
  req,
  email,
  password,
  done,
) => {
  const user = await db.dashboardUser.findOne({
    where: {
      [Op.or]: [
        {
          email: email.toLowerCase(),
        },
      ],
    },
  });
  if (!user) {
    return done(
      {
        message: 'LOGIN_FAIL',
      },
      false,
    );
  }
  if (user) {
    user.comparePassword(password, async (err, isMatch) => {
      if (!isMatch) {
        return done(
          {
            message: 'LOGIN_FAIL',
          },
          false,
        );
      }
      if (user.role < 1) {
        if (user.authused === true) {
          return done(
            {
              message: 'AUTH_TOKEN_USED',
            },
            false,
          );
        }
        const verificationToken = await generateVerificationToken(24);
        const updatedUser = await user.update({
          authexpires: verificationToken.tomorrow,
          authtoken: verificationToken.authtoken,
        });
        const {
          username,
          email,
          authtoken,
        } = updatedUser;
        sendVerificationEmail(
          username,
          email,
          authtoken,
        );
        req.session.destroy();
        return done(
          {
            message: 'EMAIL_NOT_VERIFIED',
            email,
          },
          false,
        );
      }
      req.session.tfa = user.tfa;
      done(null, user);
    });
  }
});
passport.use(localLogin);
