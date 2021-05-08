const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
// const allUniqueChars = [..."~!@#$%^&*()_+-=[]\{}|;:'\",./<>?"];
const allNumbers = [..."0123456789"];
const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];
const baseLow = [...allNumbers, ...allLowerAlpha];

export const generateRandomString = (len) => [...Array(len)]
  .map((i) => base[Math.random() * base.length | 0])
  .join('');

// export const generateRandomStringLowCase = (len) => [...Array(len)]
//  .map((i) => baseLow[Math.random() * base.length | 0])
//  .join('');

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export const generateRandomStringLowCase = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
