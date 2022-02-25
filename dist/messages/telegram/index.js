"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawalReviewMessage = exports.withdrawalAcceptedMessage = exports.withdrawalAcceptedAdminMessage = exports.welcomeMessage = exports.userNotFoundMessage = exports.unableToFindUserMessage = exports.tipSuccessMessage = exports.telegramWithdrawalRejectedMessage = exports.telegramWithdrawalConfirmedMessage = exports.telegramIncomingDepositMessage = exports.telegramDepositConfirmedMessage = exports.rainSuccessMessage = exports.rainErrorMessage = exports.notEnoughActiveUsersMessage = exports.minimumMessage = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.helpMessage = exports.groupNotFoundMessage = exports.generalErrorMessage = exports.featureDisabledServerMessage = exports.featureDisabledGlobalMessage = exports.faucetClaimedMessage = exports.depositAddressNotFoundMessage = exports.depositAddressMessage = exports.claimTooFastFaucetMessage = exports.balanceMessage = exports.InfoMessage = void 0;

var _settings = _interopRequireDefault(require("../../config/settings"));

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var featureDisabledServerMessage = function featureDisabledServerMessage() {
  var result = "This feature has been disabled for this server";
  return result;
};

exports.featureDisabledServerMessage = featureDisabledServerMessage;

var featureDisabledGlobalMessage = function featureDisabledGlobalMessage() {
  var result = "This feature has been disabled";
  return result;
};

exports.featureDisabledGlobalMessage = featureDisabledGlobalMessage;

var telegramDepositConfirmedMessage = function telegramDepositConfirmedMessage(amount) {
  var result = "Deposit Confirmed \n".concat(amount, " ").concat(settings.coin.ticker, " has been credited to your wallet");
  return result;
};

exports.telegramDepositConfirmedMessage = telegramDepositConfirmedMessage;

var telegramIncomingDepositMessage = function telegramIncomingDepositMessage(res) {
  var result = "incoming deposit detected for ".concat(res.locals.amount, " ").concat(settings.coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(settings.min.confirmations, "+ confirmations\n").concat(settings.coin.explorer, "/tx/").concat(res.locals.transaction[0].txid);
  return result;
};

exports.telegramIncomingDepositMessage = telegramIncomingDepositMessage;

var withdrawalAcceptedAdminMessage = function withdrawalAcceptedAdminMessage(updatedTrans) {
  var result = "Withdrawal Accepted\n".concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid);
  return result;
};

exports.withdrawalAcceptedAdminMessage = withdrawalAcceptedAdminMessage;

var withdrawalAcceptedMessage = function withdrawalAcceptedMessage(transaction, updatedTrans) {
  var result = "".concat(transaction.address.wallet.user.username, "'s withdrawal has been accepted\n  ").concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid);
  return result;
};

exports.withdrawalAcceptedMessage = withdrawalAcceptedMessage;

var telegramWithdrawalConfirmedMessage = function telegramWithdrawalConfirmedMessage(user) {
  var result = "".concat(user.username, "'s withdrawal has been complete");
  return result;
};

exports.telegramWithdrawalConfirmedMessage = telegramWithdrawalConfirmedMessage;

var balanceMessage = function balanceMessage(telegramUserName, user, priceInfo) {
  var result = "".concat(telegramUserName, "'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(settings.coin.ticker, "\n").concat(telegramUserName, "'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(settings.coin.ticker, "\nEstimated value of ").concat(telegramUserName, "'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2));
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

var telegramWithdrawalRejectedMessage = function telegramWithdrawalRejectedMessage() {
  var result = "Withdrawal has been rejected";
  return result;
};

exports.telegramWithdrawalRejectedMessage = telegramWithdrawalRejectedMessage;

var generalErrorMessage = function generalErrorMessage() {
  var result = "Something went wrong";
  return result;
};

exports.generalErrorMessage = generalErrorMessage;

var tipSuccessMessage = function tipSuccessMessage(user, amount, findUserToTip) {
  var result = "@".concat(user.username, " tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " to @").concat(findUserToTip.username);
  return result;
};

exports.tipSuccessMessage = tipSuccessMessage;

var minimumMessage = function minimumMessage(setting, title) {
  var result = "Minimum ".concat(title, " is ").concat(Number(setting.min) / 1e8, " ").concat(settings.coin.ticker);
  return result;
};

exports.minimumMessage = minimumMessage;

var claimTooFastFaucetMessage = function claimTooFastFaucetMessage(username, distance) {
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var result = "".concat(username, ", you have to wait ").concat(hours === 1 ? "".concat(hours, " hour") : '', " ").concat(hours > 1 ? "".concat(hours, " hours,") : '', " ").concat(minutes === 1 ? "".concat(minutes, " minute") : '', " ").concat(minutes > 1 ? "".concat(minutes, " minutes and") : '', " ").concat(seconds === 1 ? "".concat(seconds, " second") : '', " ").concat(seconds > 1 ? "".concat(seconds, " seconds") : '', " before claiming the faucet again (the faucet can be claimed every 4 hours).");
  return result;
};

exports.claimTooFastFaucetMessage = claimTooFastFaucetMessage;

var faucetClaimedMessage = function faucetClaimedMessage(username, amount) {
  var result = "".concat(username, ", you have been tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " from the faucet.");
  return result;
};

exports.faucetClaimedMessage = faucetClaimedMessage;

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
  var result = "Raining ".concat(amount / 1e8, " ").concat(settings.coin.ticker, " on ").concat(usersToRain.length, " active users -- ").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, " each");
  return result;
};

exports.rainSuccessMessage = rainSuccessMessage;

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

var depositAddressMessage = function depositAddressMessage(telegramUserName, user) {
  var result = "".concat(telegramUserName, "'s deposit address: \n*").concat(user.wallet.addresses[0].address, "*");
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var welcomeMessage = function welcomeMessage(ctx) {
  var result = "Welcome ".concat(ctx.update.message.from.username, ", we created a wallet for you.\nType \"").concat(settings.bot.command.telegram, " help\" for usage info");
  return result;
};

exports.welcomeMessage = welcomeMessage;

var helpMessage = function helpMessage(withdraw) {
  var result = "<b>Tipbot Help</b>\n      \n".concat(settings.bot.command.telegram, "\n<code>Display this message</code>\n    \n      \n").concat(settings.bot.command.telegram, " help\n/help\n<code>Display this message</code>\n    \n      \n").concat(settings.bot.command.telegram, " price\n/price\n<code>Display current ").concat(settings.coin.ticker, " price</code>\n    \n      \n").concat(settings.bot.command.telegram, " info\n/info\n<code>Displays coin info</code>\n    \n    \n").concat(settings.bot.command.telegram, " balance\n/balance\n<code>Display wallet balance</code>\n\n").concat(settings.bot.command.telegram, " faucet\n/faucet\n<code>Claim faucet</code>\n    \n      \n").concat(settings.bot.command.telegram, " tip [@user] [amount]\n/tip [@user] [amount]\n<code>Tips the @ mentioned user with the desired amount, e.g.</code>\n").concat(settings.bot.command.telegram, " tip @Bagosan 1.00\n/tip @Bagosan 1.00\n    \n      \n").concat(settings.bot.command.telegram, " rain [amount]\n/rain [amount]\n<code>Rains the desired amount onto all active users (active time 3 hours), e.g.</code>\n").concat(settings.bot.command.telegram, " rain 1.00\n/rain 1.00\n    \n      \n").concat(settings.bot.command.telegram, " deposit\n/deposit\n<code>Displays your deposit address</code>\n    \n      \n").concat(settings.bot.command.telegram, " withdraw [address] [amount]\n/withdraw [address] [amount]\n<code>Withdraws the entered amount to a ").concat(settings.coin.ticker, " address of your choice, e.g.</code>\n").concat(settings.bot.command.telegram, " withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20\n/withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20\n<code>Note: Minimal amount to withdraw: ").concat(withdraw.min / 1e8, " ").concat(settings.coin.ticker, ". A withdrawal fee of ").concat(withdraw.fee / 1e2, "% ").concat(settings.coin.ticker, " will be automatically deducted from the amount. half of the fee is donated to common faucet pot.</code>\n      \n").concat(settings.coin.name === 'Runebase' && "".concat(settings.bot.command.telegram, " referral\n/referral\n<code>Displays your referral count</code>\n<code>Note: We reward members for every 10 new members they add. current reward = 20 ").concat(settings.coin.ticker, "</code>\n      \n    \n").concat(settings.bot.command.telegram, " referral top\n/top\n<code>Displays referral top 10</code>"), "     \n");
  return result;
};

exports.helpMessage = helpMessage;

var InfoMessage = function InfoMessage(blockHeight, priceInfo) {
  var result = "<b><u>Coin Info</u></b>\n".concat(settings.coin.description, "\n\n<b><u>Coin Name</u></b>\n").concat(settings.coin.name, "\n\n<b><u>Coin Ticker</u></b>\n").concat(settings.coin.ticker, "\n\n<b><u>Current block height</u></b>\n").concat(blockHeight, "\n\n<b><u>Website</u></b>\n").concat(settings.coin.website, "\n\n<b><u>Github</u></b>\n").concat(settings.coin.github, "\n\n<b><u>Block Explorer</u></b>\n").concat(settings.coin.explorer, "\n\n<b><u>Discord Server</u></b>\n").concat(settings.coin.discord, "\n\n<b><u>Telegram Group</u></b>\n").concat(settings.coin.telegram, "\n\n<b><u>Exchanges</u></b>\n").concat(settings.coin.exchanges.join('\n'), "\n\n<b><u>Current price</u></b>\n$").concat(priceInfo.price, " (source: coinpaprika)");
  return result;
};

exports.InfoMessage = InfoMessage;