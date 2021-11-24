"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawalReviewMessage = exports.withdrawalAcceptedMessage = exports.withdrawalAcceptedAdminMessage = exports.welcomeMessage = exports.userNotFoundMessage = exports.unableToFindUserMessage = exports.tipSuccessMessage = exports.telegramIncomingDepositMessage = exports.telegramDepositConfirmedMessage = exports.rainSuccessMessage = exports.rainErrorMessage = exports.notEnoughActiveUsersMessage = exports.minimumWithdrawalMessage = exports.minimumTipMessage = exports.minimumRainMessage = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.helpMessage = exports.groupNotFoundMessage = exports.generalErrorMessage = exports.exchangeListMessage = exports.depositAddressNotFoundMessage = exports.depositAddressMessage = exports.balanceMessage = void 0;

var _settings = _interopRequireDefault(require("../../config/settings"));

/* eslint-disable import/prefer-default-export */
var telegramDepositConfirmedMessage = function telegramDepositConfirmedMessage(amount) {
  var result = "Deposit Confirmed \n".concat(amount, " ").concat(_settings["default"].coin.ticker, " has been credited to your wallet");
  return result;
};

exports.telegramDepositConfirmedMessage = telegramDepositConfirmedMessage;

var telegramIncomingDepositMessage = function telegramIncomingDepositMessage(res) {
  var result = "incoming deposit detected for ".concat(res.locals.amount, " ").concat(_settings["default"].coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(_settings["default"].min.confirmations, "+ confirmations\n").concat(_settings["default"].coin.explorer, "/tx/").concat(res.locals.transaction[0].txid);
  return result;
};

exports.telegramIncomingDepositMessage = telegramIncomingDepositMessage;

var withdrawalAcceptedAdminMessage = function withdrawalAcceptedAdminMessage(updatedTrans) {
  var result = "Withdrawal Accepted\n".concat(_settings["default"].coin.explorer, "/tx/").concat(updatedTrans.txid);
  return result;
};

exports.withdrawalAcceptedAdminMessage = withdrawalAcceptedAdminMessage;

var withdrawalAcceptedMessage = function withdrawalAcceptedMessage(transaction, updatedTrans) {
  var result = "".concat(transaction.address.wallet.user.username, "'s withdrawal has been accepted\n  ").concat(_settings["default"].coin.explorer, "/tx/").concat(updatedTrans.txid);
  return result;
};

exports.withdrawalAcceptedMessage = withdrawalAcceptedMessage;

var balanceMessage = function balanceMessage(telegramUserName, user, priceInfo) {
  var result = "".concat(telegramUserName, "'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(_settings["default"].coin.ticker, "\n").concat(telegramUserName, "'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(_settings["default"].coin.ticker, "\nEstimated value of ").concat(telegramUserName, "'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2));
  return result;
};

exports.balanceMessage = balanceMessage;

var depositAddressNotFoundMessage = function depositAddressNotFoundMessage() {
  var result = "Deposit Address not found";
  return result;
};

exports.depositAddressNotFoundMessage = depositAddressNotFoundMessage;

var withdrawalReviewMessage = function withdrawalReviewMessage() {
  var result = "Withdrawal is being reviewed";
  return result;
};

exports.withdrawalReviewMessage = withdrawalReviewMessage;

var generalErrorMessage = function generalErrorMessage() {
  var result = "Something went wrong";
  return result;
};

exports.generalErrorMessage = generalErrorMessage;

var tipSuccessMessage = function tipSuccessMessage(user, amount, findUserToTip) {
  var result = "@".concat(user.username, " tipped ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, " to @").concat(findUserToTip.username);
  return result;
};

exports.tipSuccessMessage = tipSuccessMessage;

var minimumTipMessage = function minimumTipMessage() {
  var result = "Minimum Tip is ".concat(Number(_settings["default"].min.telegram.tip) / 1e8, " ").concat(_settings["default"].coin.ticker);
  return result;
};

exports.minimumTipMessage = minimumTipMessage;

var groupNotFoundMessage = function groupNotFoundMessage() {
  var result = "Group not found";
  return result;
};

exports.groupNotFoundMessage = groupNotFoundMessage;

var rainErrorMessage = function rainErrorMessage() {
  var result = "Something went wrong with raining";
  return result;
};

exports.rainErrorMessage = rainErrorMessage;

var rainSuccessMessage = function rainSuccessMessage(amount, usersToRain, amountPerUser) {
  var result = "Raining ".concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, " on ").concat(usersToRain.length, " active users -- ").concat(amountPerUser / 1e8, " ").concat(_settings["default"].coin.ticker, " each");
  return result;
};

exports.rainSuccessMessage = rainSuccessMessage;

var minimumRainMessage = function minimumRainMessage() {
  var result = "Minimum Rain is ".concat(Number(_settings["default"].min.telegram.rain) / 1e8, " ").concat(_settings["default"].coin.ticker);
  return result;
};

exports.minimumRainMessage = minimumRainMessage;

var notEnoughActiveUsersMessage = function notEnoughActiveUsersMessage() {
  var result = "not enough active users";
  return result;
};

exports.notEnoughActiveUsersMessage = notEnoughActiveUsersMessage;

var insufficientBalanceMessage = function insufficientBalanceMessage() {
  var result = "Insufficient Balance";
  return result;
};

exports.insufficientBalanceMessage = insufficientBalanceMessage;

var unableToFindUserMessage = function unableToFindUserMessage() {
  var result = "Unable to find user";
  return result;
};

exports.unableToFindUserMessage = unableToFindUserMessage;

var userNotFoundMessage = function userNotFoundMessage() {
  var result = "User not found";
  return result;
};

exports.userNotFoundMessage = userNotFoundMessage;

var invalidAddressMessage = function invalidAddressMessage() {
  var result = "Invalid Runebase Address";
  return result;
};

exports.invalidAddressMessage = invalidAddressMessage;

var invalidAmountMessage = function invalidAmountMessage() {
  var result = "Invalid amount";
  return result;
};

exports.invalidAmountMessage = invalidAmountMessage;

var minimumWithdrawalMessage = function minimumWithdrawalMessage() {
  var result = "Minimum ".concat(_settings["default"].coin.ticker, " is ").concat(Number(_settings["default"].min.withdrawal) / 1e8, " ").concat(_settings["default"].coin.ticker);
  return result;
};

exports.minimumWithdrawalMessage = minimumWithdrawalMessage;

var depositAddressMessage = function depositAddressMessage(telegramUserName, user) {
  var result = "".concat(telegramUserName, "'s deposit address: \n*").concat(user.wallet.addresses[0].address, "*");
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var welcomeMessage = function welcomeMessage(ctx) {
  var result = "Welcome ".concat(ctx.update.message.from.username, ", we created a wallet for you.\nType \"/").concat(_settings["default"].bot.command.telegram, " help\" for usage info");
  return result;
};

exports.welcomeMessage = welcomeMessage;

var helpMessage = function helpMessage() {
  var result = "<b>Tipbot Help</b>\n      \n/".concat(_settings["default"].bot.command.telegram, "\n<code>Display this message</code>\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " help\n/help\n<code>Display this message</code>\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " price\n/price\n<code>Display current ").concat(_settings["default"].coin.ticker, " price</code>\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " exchanges\n/exchanges\n<code>Display list of exchanges to trade ").concat(_settings["default"].coin.ticker, "</code>\n    \n    \n/").concat(_settings["default"].bot.command.telegram, " balance\n/balance\n<code>Display wallet balance</code>\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " tip [@user] [amount]\n/tip [@user] [amount]\n<code>Tips the @ mentioned user with the desired amount, e.g.</code>\n/").concat(_settings["default"].bot.command.telegram, " tip @Bagosan 1.00\n/tip @Bagosan 1.00\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " rain [amount]\n/rain [amount]\n<code>Rains the desired amount onto all active users (active time 3 hours), e.g.</code>\n/").concat(_settings["default"].bot.command.telegram, " rain 1.00\n/rain 1.00\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " deposit\n/deposit\n<code>Displays your deposit address</code>\n    \n      \n/").concat(_settings["default"].bot.command.telegram, " withdraw [address] [amount]\n/withdraw [address] [amount]\n<code>Withdraws the entered amount to a ").concat(_settings["default"].coin.ticker, " address of your choice, e.g.</code>\n/").concat(_settings["default"].bot.command.telegram, " withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20\n/withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20\n<code>Note: Minimal amount to withdraw: ").concat(_settings["default"].min.withdrawal / 1e8, " ").concat(_settings["default"].coin.ticker, ". A withdrawal fee of ").concat(_settings["default"].fee.withdrawal / 1e8, " ").concat(_settings["default"].coin.ticker, " will be automatically deducted from the amount.</code>\n      \n").concat(_settings["default"].coin.name === 'Runebase' && "/".concat(_settings["default"].bot.command.telegram, " referral\n/referral\n<code>Displays your referral count</code>\n<code>Note: We reward members for every 10 new members they add. current reward = 20 ").concat(_settings["default"].coin.ticker, "</code>\n      \n    \n/").concat(_settings["default"].bot.command.telegram, " referral top\n/top\n<code>Displays referral top 10</code>"), "     \n");
  return result;
};

exports.helpMessage = helpMessage;

var exchangeListMessage = function exchangeListMessage() {
  var result = "\n<b><u>Exchanges with ".concat(_settings["default"].coin.ticker, " listed</u></b>\n  \n<b>Bololex</b>\n    \n<pre>RUNES/BTC</pre>\nhttps://bololex.com/trading/?symbol=RUNES-BTC\n    \n<pre>RUNES/USDT</pre>\nhttps://bololex.com/trading/?symbol=RUNES-USDT\n  \n<pre>RUNES/DOGE</pre>\nhttps://bololex.com/trading/?symbol=RUNES-DOGE\n  \n<pre>RUNES/ETH</pre>\nhttps://bololex.com/trading/?symbol=RUNES-ETH\n  \n<pre>RUNES/BOLO</pre>\nhttps://bololex.com/trading/?symbol=RUNES-BOLO\n  \n<b>Altmarkets</b>\n    \n<pre>RUNES/DOGE</pre>\nhttps://v2.altmarkets.io/trading/runesdoge\n    \n<b>TxBit</b>\n    \n<pre>RUNES/BTC</pre>\nhttps://txbit.io/Trade/RUNES/BTC\n    \n<pre>RUNES/ETH</pre>\nhttps://txbit.io/Trade/RUNES/ETH\n    \n<b>StakeCenter</b>\n   \n<pre>RUNES/BTC</pre>\nhttps://stakecenter.co/client/exchange/BTC/RUNES\n    \n<pre>RUNES/LTC</pre>\nhttps://stakecenter.co/client/exchange/LTC/RUNES\n    \n<pre>RUNES/DOGE</pre>\nhttps://stakecenter.co/client/exchange/DOGE/RUNES\n    \n<pre>RUNES/RDD</pre>\nhttps://stakecenter.co/client/exchange/RDD/RUNES\n    \n<b>LocalRunes (any local currency)</b>\nhttps://www.localrunes.com/");
  return result;
};

exports.exchangeListMessage = exchangeListMessage;