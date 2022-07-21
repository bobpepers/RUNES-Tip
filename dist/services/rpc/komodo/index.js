"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var HttpProvider = require('../httpprovider');

var Komodo = /*#__PURE__*/function () {
  function Komodo(url) {
    (0, _classCallCheck2["default"])(this, Komodo);
    this.provider = new HttpProvider(url);
  }
  /** ******** MISC ********* */

  /**
   * Checks if the blockchain is connected.
   * @return If blockchain is connected.
   */


  (0, _createClass2["default"])(Komodo, [{
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
    /** ******** CONTROL ********* */

    /**
     * Get the blockchain info.
     * @return {Promise} Blockchain info object or Error
     */

  }, {
    key: "getInfo",
    value: function getInfo() {
      return this.provider.rawCall('getinfo');
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
     * Validates if a valid Pirate address.
     * @param {string} address Pirate address to validate.
     * @return {Promise} Object with validation info or Error.
     */

  }, {
    key: "validateAddress",
    value: function validateAddress(address) {
      return this.provider.rawCall('validateaddress', [address]);
    }
    /** ******** WALLET ********* */

    /**
     * Lists transactions
     * @param {string} * All accounts
     * @param {string} mostRecent Number of most recent transactions
     * @return {Promise} Success or Error.
     */

  }, {
    key: "listTransactions",
    value: function listTransactions(mostRecent) {
      return this.provider.rawCall('listtransactions', ['*', mostRecent]);
    }
    /**
     * Lists all balances
     * @return {Promise} Array of unspent transaction outputs or Error
     */

  }, {
    key: "zGetBalances",
    value: function zGetBalances() {
      return this.provider.rawCall('z_getbalances');
    }
  }, {
    key: "getBalance",
    value: function getBalance() {
      return this.provider.rawCall('getbalance');
    }
  }, {
    key: "zMergeToAddress",
    value: function zMergeToAddress(fromAddresses, toAddress) {
      return this.provider.rawCall('z_mergetoaddress', [fromAddresses, toAddress]);
    }
    /**
     * Send ARRR to many
     * @param {string} address The Pirate address to send ARRR from.
     * @param {object} object Object with receiver information. [{"address": "zs127z2s66v207g7t3myxklafv28ecffpxmphv5pdx3he79dr8yaqwze47hy29f4l68kx7fsp5cms2", "amount": 0.1}]
     * @param {number} (numeric, optional, default=1) Only use funds confirmed at least this many times.
     * @param {number} (numeric, optional, default=0.0001) The fee amount to attach to this transaction.
     * @return {Promise} Array of unspent transaction outputs or Error
     */

  }, {
    key: "zSendMany",
    value: function zSendMany(address, object) {
      var minconf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var fee = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.0001;
      return this.provider.rawCall('z_sendmany', [address, object, minconf, fee]);
    }
    /**
     * Get operation status
     * @param {array} Array Array with opration Id. ["zs127z2s66v207g7t3myxklafv28ecffpxmphv5pdx3he79dr8yaqwze47hy29f4l68kx7fsp5cms2"]
     * @return {Promise} Array of operation statusses
     */

  }, {
    key: "zGetOperationStatus",
    value: function zGetOperationStatus() {
      var arrr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return this.provider.rawCall('z_getoperationstatus', [arrr]);
    }
    /**
     * Reveals the private key corresponding to the z_address.
     * @param {string} address The Pirate z_address for the private key.
     * @return {Promise} Private key or Error.
     */

  }, {
    key: "zExportKey",
    value: function zExportKey(address) {
      return this.provider.rawCall('z_exportkey', [address]);
    }
    /**
     * Gets a new Pirate address for receiving payments.
     * @param {string} acctName The account name for the address to be linked to ("" for default).
     * @return {Promise} Pirate address or Error.
     */

  }, {
    key: "getNewAddress",
    value: function getNewAddress() {
      return this.provider.rawCall('getnewaddress');
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
     * Gets a list of unspent transactions
     * @return {Promise} Promise containing result object or Error
     */

  }, {
    key: "listUnspent",
    value: function listUnspent() {
      return this.provider.rawCall('listunspent');
    }
    /**
     * Lists unspent transaction outputs.
     * @param {string} address Address to send Pirate to.
     * @param {number} amount Amount of Pirate to send.
     * @param {number} minconf (numeric, optional, default=1) Only use funds with at least this many confirmations.
     * @param {string} comment Comment used to store what the transaction is for.
     * @param {string} commentTo Comment to store name/organization to which you're sending the transaction.
     * @param {string} subtractFeeFromAmount (boolean, optional, default=false) The fee will be deducted from the amount being sent.The recipient will receive less KOMODO than you enter in the amount field.
     * @return {Promise} Transaction ID or Error
     */

  }, {
    key: "sendToAddress",
    value: function sendToAddress(address, amount) {
      var comment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var commentTo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var subtractFeeFromAmount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      return this.provider.rawCall('sendtoaddress', [address, amount, comment, commentTo, subtractFeeFromAmount]);
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
  return Komodo;
}();

module.exports = Komodo;