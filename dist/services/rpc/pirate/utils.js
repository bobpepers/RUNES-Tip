"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ = require('lodash');

var Utils = /*#__PURE__*/function () {
  function Utils() {
    (0, _classCallCheck2["default"])(this, Utils);
  }

  (0, _createClass2["default"])(Utils, null, [{
    key: "isPirateAddress",
    value:
    /**
     * Returns true if given string is valid runebase address
     * @method isPirateAddress
     * @param {String}
     * @return {Boolean}
     */
    function isPirateAddress(address) {
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
  }]);
  return Utils;
}();

module.exports = Utils;