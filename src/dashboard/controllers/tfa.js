import * as OTPAuth from 'otpauth';
import db from '../../models';
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

export const disabletfa = async (
  req,
  res,
  next,
) => {
  const user = await db.dashboardUser.findOne({
    where: {
      id: req.user.id,
    },
  });

  const totp = new OTPAuth.TOTP({
    issuer: settings.coin.name,
    label: settings.bot.name,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: user.tfa_secret, // or "OTPAuth.Secret.fromBase32(user.tfa_secret)"
  });

  const verified = totp.validate({
    token: req.body.tfa,
    window: 1,
  });

  if (
    verified === 0
    && user
    && user.tfa === true
  ) {
    const updatedUser = await user.update({
      tfa: false,
      tfa_secret: '',
    });
    res.locals.tfa = updatedUser.tfa;
    res.locals.success = true;
    res.locals.result = {
      tfa: updatedUser.tfa,
      success: true,
    };
    return next();
  }
  throw new Error("Wrong TFA Number");
};

export const enabletfa = async (
  req,
  res,
  next,
) => {
  const totp = new OTPAuth.TOTP({
    issuer: settings.coin.name,
    label: settings.bot.name,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: req.body.secret, // or "OTPAuth.Secret.fromBase32(user.tfa_secret)"
  });

  const verified = totp.validate({
    token: req.body.tfa,
    window: 1,
  });

  const user = await db.dashboardUser.findOne({
    where: {
      id: req.user.id,
    },
  });

  if (
    verified !== 0
    && user
  ) {
    throw new Error("Invalid token or secret");
  }
  if (
    verified === 0
    && !user
  ) {
    throw new Error("User does not exist");
  }
  if (
    verified === 0
    && user
    && user.tfa === false
  ) {
    const updatedUser = await user.update({
      tfa: true,
      tfa_secret: req.body.secret,
    });
    res.locals.tfa = updatedUser.tfa;
    res.locals.result = {
      tfa: updatedUser.tfa,
    };
    return next();
  }
  next();
};

export const ensuretfa = (
  req,
  res,
  next,
) => {
  if (req.session.tfa === true) {
    res.json({
      success: true,
      tfaLocked: true,
    });
  }
  if (req.session.tfa === false) {
    next();
  }
};

export const istfa = (
  req,
  res,
  next,
) => {
  // console.log(req.session.tfa);
  if (req.session.tfa === true) {
    console.log('TFA IS LOCKED');
    res.json({
      result: {
        success: true,
        tfaLocked: true,
      },
    });
  }
  if (req.session.tfa === false) {
    console.log('TFA IS UNLOCKED');
    res.json({
      result: {
        success: true,
        tfaLocked: false,
      },
    });
  }
};

export const unlocktfa = (
  req,
  res,
  next,
) => {
  const totp = new OTPAuth.TOTP({
    issuer: settings.coin.name,
    label: settings.bot.name,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: req.user.tfa_secret, // or "OTPAuth.Secret.fromBase32(user.tfa_secret)"
  });

  const verified = totp.validate({
    token: req.body.tfa,
    window: 1,
  });

  if (verified === 0) {
    req.session.tfa = false;
    res.locals.result = {
      success: true,
      tfaLocked: false,
    };
    return next();
  }

  if (!verified) {
    throw new Error("Wrong TFA Number");
  }
};
