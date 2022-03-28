const _ = require('lodash');

class Utils {
  /**
   * Returns true if given string is valid runebase address
   * @method isRunebaseAddress
   * @param {String}
   * @return {Boolean}
   */
  static isRunebaseAddress(address) {
    if (_.isUndefined(address)) {
      return false;
    }

    if (_.size(address) !== 34) {
      return false;
    }

    if (!address.startsWith('5') && !address.startsWith('R')) {
      return false;
    }

    return true;
  }
}

module.exports = Utils;
