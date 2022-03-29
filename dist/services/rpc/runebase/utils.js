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
    key: "isRunebaseAddress",
    value:
    /**
     * Returns true if given string is valid runebase address
     * @method isRunebaseAddress
     * @param {String}
     * @return {Boolean}
     */
    function isRunebaseAddress(address) {
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
  }]);
  return Utils;
}();

module.exports = Utils;