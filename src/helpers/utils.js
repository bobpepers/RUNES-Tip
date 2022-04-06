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
