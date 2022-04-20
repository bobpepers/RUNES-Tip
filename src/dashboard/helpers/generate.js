import bcrypt from 'bcrypt-nodejs';
import { config } from "dotenv";
import crypto from "crypto";

config();

export const generateHash = (a) => crypto.createHmac('sha256', process.env.SESSION_SECRET).update(a).digest('hex');

// eslint-disable-next-line import/prefer-default-export
export const generateVerificationToken = (expireHours) => {
  const generateToken = new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(process.env.SESSION_SECRET, salt, null, (err, hash) => {
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
