import crypto from "crypto";
import { generateHash } from './generate';

const timingSafeEqual = (a, b) => {
  let valid = false;
  valid = crypto.timingSafeEqual(Buffer.from(generateHash(a)), Buffer.from(generateHash(b)));
  return valid;
};

export default timingSafeEqual;
