const _ = require('lodash');

class Utils {
  /**
   * Returns true if given string is valid runebase address
   * @method isPirateAddress
   * @param {String}
   * @return {Boolean}
   */
  static isPirateAddress(address) {
    if (_.isUndefined(address)) {
      return false;
    }

    if (_.size(address) !== 78) {
      return false;
    }

    if (!address.startsWith('z')) {
      return false;
    }

    return true;
  }
}

module.exports = Utils;
