const _ = require('lodash');

class Utils {
  /**
   * Returns true if given string is valid runebase address
   * @method isPirateAddress
   * @param {String}
   * @return {Boolean}
   */
  static isKomodoAddress(address) {
    if (_.isUndefined(address)) {
      return false;
    }

    if (_.size(address) !== 34) {
      return false;
    }

    if (!address.startsWith('R')) {
      return false;
    }

    return true;
  }
}

module.exports = Utils;
