"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var HttpProvider = require('../httpprovider');

var Runebase = /*#__PURE__*/function () {
  function Runebase(url) {
    (0, _classCallCheck2["default"])(this, Runebase);
    this.provider = new HttpProvider(url);
  }
  /** ******** MISC ********* */

  /**
   * Checks if the blockchain is connected.
   * @return If blockchain is connected.
   */


  (0, _createClass2["default"])(Runebase, [{
    key: "isConnected",
    value: function () {
      var _isConnected = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var res;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.provider.rawCall('getnetworkinfo');

              case 3:
                res = _context.sent;
                return _context.abrupt("return", (0, _typeof2["default"])(res) === 'object');

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", false);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function isConnected() {
        return _isConnected.apply(this, arguments);
      }

      return isConnected;
    }()
    /** ******** BLOCKCHAIN ********* */

    /**
     * Returns the block info for a given block hash.
     * @param {string} blockHash The block hash to look up.
     * @param {boolean} verbose True for a json object or false for the hex encoded data.
     * @return {Promise} Latest block info or Error.
     */

  }, {
    key: "getBlock",
    value: function getBlock(blockHash) {
      var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.provider.rawCall('getblock', [blockHash, verbose]);
    }
    /**
     * Returns various state info regarding blockchain processing.
     * @return {Promise} Latest block info or Error.
     */

  }, {
    key: "getBlockchainInfo",
    value: function getBlockchainInfo() {
      return this.provider.rawCall('getblockchaininfo');
    }
    /**
     * Returns the current block height that is synced.
     * @return {Promise} Current block count or Error.
     */

  }, {
    key: "getBlockCount",
    value: function getBlockCount() {
      return this.provider.rawCall('getblockcount');
    }
    /**
     * Returns the block hash of the block height number specified.
     * @param {number} blockNum The block number to look up.
     * @return {Promise} Block hash or Error.
     */

  }, {
    key: "getBlockHash",
    value: function getBlockHash(blockNum) {
      return this.provider.rawCall('getblockhash', [blockNum]);
    }
    /**
     * Returns the transaction receipt given the txid.
     * @param {string} txid The transaction id to look up.
     * @return {Promise} Transaction receipt or Error.
     */

  }, {
    key: "listTransactions",
    value: function listTransactions(mostRecent) {
      return this.provider.rawCall('listtransactions', ["*", mostRecent]);
    }
    /** ******** NETWORK ********* */

    /**
     * Returns data about each connected network node as a json array of objects.
     * @return {Promise} Node info object or Error
     */

  }, {
    key: "getPeerInfo",
    value: function getPeerInfo() {
      return this.provider.rawCall('getpeerinfo');
    }
    /** ******** UTIL ********* */

    /**
     * Validates if a valid Runebase address.
     * @param {string} address Runebase address to validate.
     * @return {Promise} Object with validation info or Error.
     */

  }, {
    key: "validateAddress",
    value: function validateAddress(address) {
      return this.provider.rawCall('validateaddress', [address]);
    }
    /**
     * Gets a new Runebase address for receiving payments.
     * @param {string} acctName The account name for the address to be linked to ("" for default).
     * @return {Promise} Runebase address or Error.
     */

  }, {
    key: "getNewAddress",
    value: function getNewAddress() {
      var acctName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return this.provider.rawCall('getnewaddress', [acctName]);
    }
    /**
     * Get transaction details by txid
     * @param {string} txid The transaction id (64 char hex string).
     * @return {Promise} Promise containing result object or Error
     */

  }, {
    key: "getTransaction",
    value: function getTransaction(txid) {
      return this.provider.rawCall('gettransaction', [txid]);
    }
    /**
     * Gets the wallet info
     * @return {Promise} Promise containing result object or Error
     */

  }, {
    key: "getWalletInfo",
    value: function getWalletInfo() {
      return this.provider.rawCall('getwalletinfo');
    }
    /**
     * Lists unspent transaction outputs.
     * @param {string} address Address to send RUNEBASE to.
     * @param {number} amount Amount of RUNEBASE to send.
     * @param {string} comment Comment used to store what the transaction is for.
     * @param {string} commentTo Comment to store name/organization to which you're sending the transaction.
     * @param {boolean} subtractFeeFromAmount The fee will be deducted from the amount being sent.
     * @param {boolean} replaceable Allow this transaction to be replaced by a transaction with higher fees via BIP 125.
     * @param {number} confTarget Confirmation target (in blocks).
     * @param {string} estimateMode The fee estimate mode, must be one of: "UNSET", "ECONOMICAL", "CONSERVATIVE"
     * @param {string} senderAddress The RUNEBASE address that will be used to send money from.
     * @param {boolean} changeToSender Return the change to the sender.
     * @return {Promise} Transaction ID or Error
     */

  }, {
    key: "sendToAddress",
    value: function sendToAddress(address, amount) {
      var comment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var commentTo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var subtractFeeFromAmount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var replaceable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      var confTarget = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 6;
      var estimateMode = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'UNSET';
      var senderAddress = arguments.length > 8 ? arguments[8] : undefined;
      var changeToSender = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
      return this.provider.rawCall('sendtoaddress', [address, amount, comment, commentTo, subtractFeeFromAmount, replaceable, confTarget, estimateMode, senderAddress, changeToSender]);
    }
    /**
     * Locks the encrypted wallet.
     * @return {Promise} Success or Error.
     */

  }, {
    key: "walletLock",
    value: function walletLock() {
      return this.provider.rawCall('walletlock');
    }
    /**
     * Unlocks the encrypted wallet with the wallet passphrase.
     * @param {string} passphrase The wallet passphrase.
     * @param {number} timeout The number of seconds to keep the wallet unlocked.
     * @param {boolean} stakingOnly Unlock wallet for staking only.
     * @return {Promise} Success or Error.
     */

  }, {
    key: "walletPassphrase",
    value: function walletPassphrase(passphrase, timeout) {
      var stakingOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return this.provider.rawCall('walletpassphrase', [passphrase, timeout, stakingOnly]);
    }
  }]);
  return Runebase;
}();

module.exports = Runebase;