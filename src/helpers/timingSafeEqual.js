import { generateHash } from './generate';

import crypto from "crypto";

const timingSafeEqual = (a, b) => {
  let valid = false;
  valid = crypto.timingSafeEqual(Buffer.from(generateHash(a)), Buffer.from(generateHash(b)));
  return valid;
};

export default timingSafeEqual;
