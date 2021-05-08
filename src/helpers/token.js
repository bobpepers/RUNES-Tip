import jwt from 'jwt-simple';

require('dotenv').config();

export function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

export function decodeToken(token) {
  return jwt.decode(token, process.env.JWT_SECRET);
}
