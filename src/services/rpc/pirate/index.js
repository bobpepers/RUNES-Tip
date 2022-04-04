const Pirate = require('./pirate');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Pirate === 'undefined') {
  window.Pirate = Pirate;
}

module.exports = {
  Pirate,
};
