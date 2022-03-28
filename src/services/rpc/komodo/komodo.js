// const _ = require('lodash');
const HttpProvider = require('../httpprovider');
const Utils = require('./utils');

class Komodo {
  constructor(url) {
    this.provider = new HttpProvider(url);
    this.utils = Utils;
  }

  /** ******** MISC ********* */
  /**
   * Checks if the blockchain is connected.
   * @return If blockchain is connected.
   */
  async isConnected() {
    try {
      const res = await this.provider.rawCall('getnetworkinfo');
      return typeof res === 'object';
    } catch (err) {
      return false;
    }
  }

  /** ******** BLOCKCHAIN ********* */
  /**
   * Returns the block info for a given block hash.
   * @param {string} blockHash The block hash to look up.
   * @param {boolean} verbose True for a json object or false for the hex encoded data.
   * @return {Promise} Latest block info or Error.
   */
  getBlock(blockHash, verbose = true) {
    return this.provider.rawCall('getblock', [blockHash, verbose]);
  }

  /**
   * Returns various state info regarding blockchain processing.
   * @return {Promise} Latest block info or Error.
   */
  getBlockchainInfo() {
    return this.provider.rawCall('getblockchaininfo');
  }

  /**
   * Returns the current block height that is synced.
   * @return {Promise} Current block count or Error.
   */
  getBlockCount() {
    return this.provider.rawCall('getblockcount');
  }

  /**
   * Returns the block hash of the block height number specified.
   * @param {number} blockNum The block number to look up.
   * @return {Promise} Block hash or Error.
   */
  getBlockHash(blockNum) {
    return this.provider.rawCall('getblockhash', [blockNum]);
  }

  /** ******** CONTROL ********* */
  /**
   * Get the blockchain info.
   * @return {Promise} Blockchain info object or Error
   */
  getInfo() {
    return this.provider.rawCall('getinfo');
  }

  /** ******** NETWORK ********* */
  /**
   * Returns data about each connected network node as a json array of objects.
   * @return {Promise} Node info object or Error
   */
  getPeerInfo() {
    return this.provider.rawCall('getpeerinfo');
  }

  /** ******** UTIL ********* */
  /**
   * Validates if a valid Pirate address.
   * @param {string} address Pirate address to validate.
   * @return {Promise} Object with validation info or Error.
   */
  validateAddress(address) {
    return this.provider.rawCall('validateaddress', [address]);
  }

  /** ******** WALLET ********* */
  /**
   * Lists transactions
   * @param {string} * All accounts
   * @param {string} mostRecent Number of most recent transactions
   * @return {Promise} Success or Error.
   */
  listTransactions(mostRecent) {
    return this.provider.rawCall('listtransactions', ['*', mostRecent]);
  }

  /**
   * Lists all balances
   * @return {Promise} Array of unspent transaction outputs or Error
   */
  zGetBalances() {
    return this.provider.rawCall('z_getbalances');
  }

  /**
   * Send ARRR to many
   * @param {string} address The Pirate address to send ARRR from.
   * @param {object} object Object with receiver information. [{"address": "zs127z2s66v207g7t3myxklafv28ecffpxmphv5pdx3he79dr8yaqwze47hy29f4l68kx7fsp5cms2", "amount": 0.1}]
   * @param {number} (numeric, optional, default=1) Only use funds confirmed at least this many times.
   * @param {number} (numeric, optional, default=0.0001) The fee amount to attach to this transaction.
   * @return {Promise} Array of unspent transaction outputs or Error
   */
  zSendMany(address, object, minconf = 1, fee = 0.0001) {
    return this.provider.rawCall('z_sendmany', [address, object, minconf, fee]);
  }

  /**
   * Get operation status
   * @param {array} Array Array with opration Id. ["zs127z2s66v207g7t3myxklafv28ecffpxmphv5pdx3he79dr8yaqwze47hy29f4l68kx7fsp5cms2"]
   * @return {Promise} Array of operation statusses
   */
  zGetOperationStatus(arrr = []) {
    return this.provider.rawCall('z_getoperationstatus', [arrr]);
  }

  /**
   * Reveals the private key corresponding to the z_address.
   * @param {string} address The Pirate z_address for the private key.
   * @return {Promise} Private key or Error.
   */
  zExportKey(address) {
    return this.provider.rawCall('z_exportkey', [address]);
  }

  /**
   * Gets a new Pirate address for receiving payments.
   * @param {string} acctName The account name for the address to be linked to ("" for default).
   * @return {Promise} Pirate address or Error.
   */
  getNewAddress() {
    return this.provider.rawCall('getnewaddress');
  }

  /**
   * Get transaction details by txid
   * @param {string} txid The transaction id (64 char hex string).
   * @return {Promise} Promise containing result object or Error
   */
  getTransaction(txid) {
    return this.provider.rawCall('gettransaction', [txid]);
  }

  /**
   * Gets the wallet info
   * @return {Promise} Promise containing result object or Error
   */
  getWalletInfo() {
    return this.provider.rawCall('getwalletinfo');
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
  sendToAddress(
    address,
    amount,
    comment = '',
    commentTo = '',
    subtractFeeFromAmount = false,
  ) {
    return this.provider.rawCall('sendtoaddress', [
      address,
      amount,
      comment,
      commentTo,
      subtractFeeFromAmount,
    ]);
  }

  /**
   * Locks the encrypted wallet.
   * @return {Promise} Success or Error.
   */
  walletLock() {
    return this.provider.rawCall('walletlock');
  }

  /**
   * Unlocks the encrypted wallet with the wallet passphrase.
   * @param {string} passphrase The wallet passphrase.
   * @param {number} timeout The number of seconds to keep the wallet unlocked.
   * @param {boolean} stakingOnly Unlock wallet for staking only.
   * @return {Promise} Success or Error.
   */
  walletPassphrase(passphrase, timeout, stakingOnly = false) {
    return this.provider.rawCall('walletpassphrase', [passphrase, timeout, stakingOnly]);
  }
}

module.exports = Komodo;
