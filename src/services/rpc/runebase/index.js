const Runebase = require('./runebase');
const Utils = require('./utils');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Runebase === 'undefined') {
  window.Runebase = Runebase;
}

module.exports = {
  Runebase,
  Utils,
};
