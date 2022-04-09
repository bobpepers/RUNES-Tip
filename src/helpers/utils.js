const utf8 = require('utf8');

export const fromUtf8ToHex = async (str) => {
  if (str) {
    const string = utf8.encode(str);
    let hex = '';
    for (let i = 0; i < string.length; i += 1) {
      const code = string.charCodeAt(i);
      if (code === 0) {
        break;
      }

      const n = code.toString(16);
      hex += n.length < 2 ? `0${n}` : n;
    }
    return `${hex}`;
  }
  return false;
};

export const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// Unused Array Shufflers, we're using Lodash array shuffler
function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // eslint-disable-next-line no-param-reassign
    [array[parseInt(currentIndex, 10)], array[parseInt(randomIndex, 10)]] = [
      array[parseInt(randomIndex, 10)], array[parseInt(currentIndex, 10)]];
  }

  return array;
}
