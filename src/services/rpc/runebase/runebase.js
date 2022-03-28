const { isString, isFinite } = require('lodash');
const HttpProvider = require('../httpprovider');
const Utils = require('./utils');

class Runebase {
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

  /**
   * Returns the transaction receipt given the txid.
   * @param {string} txid The transaction id to look up.
   * @return {Promise} Transaction receipt or Error.
   */
  listTransactions(mostRecent) {
    return this.provider.rawCall('listtransactions', ["*", mostRecent]);
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
   * Validates if a valid Runebase address.
   * @param {string} address Runebase address to validate.
   * @return {Promise} Object with validation info or Error.
   */
  validateAddress(address) {
    return this.provider.rawCall('validateaddress', [address]);
  }

  /**
   * Gets the account name associated with the Runebase address.
   * @param {string} address The runebase address for account lookup.
   * @return {Promise} Account name or Error.
   */
  getAddressInfo(address) {
    return this.provider.rawCall('getaddressinfo', [address]);
  }

  /**
   * Gets a new Runebase address for receiving payments.
   * @param {string} acctName The account name for the address to be linked to ("" for default).
   * @return {Promise} Runebase address or Error.
   */
  getNewAddress(acctName = '') {
    return this.provider.rawCall('getnewaddress', [acctName]);
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
  sendToAddress(
    address,
    amount,
    comment = '',
    commentTo = '',
    subtractFeeFromAmount = false,
    replaceable = true,
    confTarget = 6,
    estimateMode = 'UNSET',
    senderAddress,
    changeToSender = false,
  ) {
    return this.provider.rawCall('sendtoaddress', [
      address,
      amount,
      comment,
      commentTo,
      subtractFeeFromAmount,
      replaceable,
      confTarget,
      estimateMode,
      senderAddress,
      changeToSender,
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

module.exports = Runebase;
