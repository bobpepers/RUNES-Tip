import bcrypt from 'bcrypt-nodejs';

const crypto = require('crypto');

export const generateHash = (a) => crypto.createHmac('sha256', 'SuperSexySecret').update(a).digest('hex');

// eslint-disable-next-line import/prefer-default-export
export const generateVerificationToken = (expireHours) => {
  const generateToken = new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash('SuperSexySecret', salt, null, (err, hash) => {
        if (err) reject(err);
        const expires = new Date();
        expires.setHours(expires.getHours() + expireHours);
        resolve(
          {
            token: generateHash(hash),
            expires,
          },
        );
      });
    });
  });
  return generateToken;
};
