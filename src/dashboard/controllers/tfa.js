import db from '../../models';

const speakeasy = require('speakeasy');

export const disabletfa = async (req, res, next) => {
  const user = await db.dashboardUser.findOne({
    where: {
      id: req.user.id,
    },
  });
  const verified = speakeasy.totp.verify({
    secret: user.tfa_secret,
    encoding: 'base32',
    token: req.body.tfa,
  });
  if (verified && user && user.tfa === true) {
    await user.update({
      tfa: false,
      tfa_secret: '',
    }).then((result) => {
      res.json({ data: result.tfa });
    });
  }
  next();
};

export const enabletfa = async (req, res, next) => {
  // Use verify() to check the token against the secret
  console.log(req);
  const verified = speakeasy.totp.verify({
    secret: req.body.secret,
    encoding: 'base32',
    token: req.body.tfa,
  });

  const user = await db.dashboardUser.findOne({
    where: {
      id: req.user.id,
    },
  });
  if (!verified && user) {
    console.log('invalid token or secret');
    res.status(400).send(new Error('Invalid token or secret'));
  }
  if (verified && !user) {
    res.status(400).send(new Error('User does not exist'));
  }
  if (verified && user && user.tfa === false) {
    await user.update({
      tfa: true,
      tfa_secret: req.body.secret,
    }).then((result) => {
      res.json({ data: result.tfa });
    });
    console.log('insert into db');
  }
  next();
};

export const ensuretfa = (req, res, next) => {
  console.log(req.session.tfa);
  if (req.session.tfa === true) {
    console.log('ensuretfa');
    res.json({
      success: true,
      tfaLocked: true,
    });
  }
  if (req.session.tfa === false) {
    console.log('we can pass');
    next();
  }
};

export const istfa = (req, res, next) => {
  console.log(req.session.tfa);
  if (req.session.tfa === true) {
    console.log('TFA IS LOCKED');
    res.json({
      success: true,
      tfaLocked: true,
    });
  }
  if (req.session.tfa === false) {
    console.log('TFA IS UNLOCKED');
    res.json({
      success: true,
      tfaLocked: false,
    });
  }
};

export const unlocktfa = (req, res, next) => {
  const verified = speakeasy.totp.verify({
    secret: req.user.tfa_secret,
    encoding: 'base32',
    token: req.body.tfa,
  });

  console.log(verified);
  if (verified) {
    req.session.tfa = false;
    console.log(req.session);
    console.log('great');
    res.json({
      success: true,
      tfaLocked: false,
    });
  }

  if (!verified) {
    console.log('not verifided');
    res.status(400).send(new Error('Unable to verify'));
  }
};
