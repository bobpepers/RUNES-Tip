"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnDirectMessage = exports.walletNotFoundMessage = exports.userListMessage = exports.timeOutAllAmoutMessage = exports.testMessage = exports.settingsNotFoundMessage = exports.reviewMessage = exports.notInDirectMessage = exports.notEnoughUsers = exports.nodeOfflineMessage = exports.minimumMessage = exports.matrixWithdrawalConfirmedMessage = exports.matrixWithdrawalAcceptedMessage = exports.matrixWelcomeMessage = exports.matrixUserBannedMessage = exports.matrixRoomBannedMessage = exports.matrixIncomingDepositMessage = exports.matrixDepositConfirmedMessage = exports.matrixBotMaintenanceMessage = exports.matrixBotDisabledMessage = exports.inviteMatrixDirectMessageRoom = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.helpMessage = exports.featureDisabledServerMessage = exports.featureDisabledGlobalMessage = exports.featureDisabledChannelMessage = exports.errorMessage = exports.depositAddressMessage = exports.confirmAllAmoutMessage = exports.canceledAllAmoutMessage = exports.balanceMessage = exports.afterSuccessMessage = void 0;

var _package = _interopRequireDefault(require("../../../package.json"));

var _settings = _interopRequireDefault(require("../../config/settings"));

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var matrixBotDisabledMessage = function matrixBotDisabledMessage() {
  var result = {
    body: "Matrix tipbot disabled\n\n".concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Matrix tipbot disabled</strong></p>\n<font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixBotDisabledMessage = matrixBotDisabledMessage;

var matrixBotMaintenanceMessage = function matrixBotMaintenanceMessage() {
  var result = {
    body: "Matrix tipbot maintenance\n\n".concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Matrix tipbot maintenance</strong></p>\n<font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixBotMaintenanceMessage = matrixBotMaintenanceMessage;

var matrixWelcomeMessage = function matrixWelcomeMessage(username) {
  var result = {
    body: "Welcome ".concat(username, ", we created a wallet for you.\nType \"").concat(settings.bot.command.matrix, " help\" for usage info\n\n").concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Welcome ".concat(username, ", we created a wallet for you.\nType \"").concat(settings.bot.command.matrix, " help\" for usage info</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixWelcomeMessage = matrixWelcomeMessage;

var inviteMatrixDirectMessageRoom = function inviteMatrixDirectMessageRoom(username) {
  var result = {
    body: "".concat(username, ", i invited you to a direct message room.\nPlease accept the invite to allow full functionality of this bot.\n\n").concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(username, ", i invited you to a direct message room.</strong></p>\n<p><strong>Please accept the invite to allow full functionality of this bot.</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.inviteMatrixDirectMessageRoom = inviteMatrixDirectMessageRoom;

var warnDirectMessage = function warnDirectMessage(username, title) {
  var result = {
    body: "".concat(title, "\n\n").concat(username, ", i've sent you a direct message.\n    \n").concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p>".concat(title, "</p><p><strong>").concat(username, ", i've sent you a direct message</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.warnDirectMessage = warnDirectMessage;

var helpMessage = function helpMessage() {
  var result = {
    is_direct: true,
    body: "Help v".concat(_package["default"].version, "\n    ").concat(settings.bot.command.matrix, " \nshow this help message\n\n").concat(settings.bot.command.matrix, "  help\nshow this help message\n\n").concat(settings.bot.command.matrix, "  deposit\nDisplays your deposit address\n\n").concat(settings.bot.command.matrix, " withdraw <address> <amount|all>\nWithdraws the entered amount to a ").concat(settings.coin.name, " address of your choice\n\n").concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Help message v".concat(_package["default"].version, "</strong></p\n    >\n<code>").concat(settings.bot.command.matrix, "</code>\n<p>show this help message</p>\n\n<code>").concat(settings.bot.command.matrix, " help</code>\n<p>show this message</p>\n\n<code>").concat(settings.bot.command.matrix, " deposit</code>\n<p>Displays your deposit address</p>\n\n<code>").concat(settings.bot.command.matrix, " withdraw [address] [amount|all]</code>\n<p>Withdraws the entered amount to a ").concat(settings.coin.name, " address of your choice</p>\n\n<code>").concat(settings.bot.command.matrix, " balance</code>\n<p>Displays balance</p>\n\n<code>").concat(settings.bot.command.discord, " flood [amount|all]</code>\n<p>Floods the desired amount onto all users (including offline users)<br>\nexample: ").concat(settings.bot.command.discord, " flood 5.00</p>\n\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.helpMessage = helpMessage;

var balanceMessage = function balanceMessage(userId, user, priceInfo) {
  var result = {
    body: "".concat(user.username, "'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(settings.coin.ticker, "\n").concat(user.username, "'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(settings.coin.ticker, "\nEstimated value of ").concat(user.username, "'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2)),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote>\n<p>".concat(user.username, "'s current available balance: <strong>").concat(user.wallet.available / 1e8, " ").concat(settings.coin.ticker, "</strong><br>\n").concat(user.username, "'s current locked balance: <strong>").concat(user.wallet.locked / 1e8, " ").concat(settings.coin.ticker, "</strong><br>\nEstimated value of ").concat(user.username, "'s balance: <strong>$").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2), "</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.balanceMessage = balanceMessage;

var depositAddressMessage = function depositAddressMessage(user) {
  var result = {
    body: "deposit address: ".concat(user.wallet.addresses[0].address, "\n").concat(settings.bot.name, " v").concat(_package["default"].version),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>deposit address: </strong>".concat(user.wallet.addresses[0].address, "</p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var matrixIncomingDepositMessage = function matrixIncomingDepositMessage(res) {
  var result = {
    body: "incoming deposit detected for ".concat(res.locals.amount, " ").concat(settings.coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(settings.min.confirmations, "+ confirmations\n").concat(settings.coin.explorer, "/tx/").concat(res.locals.transaction[0].txid),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote>\n<p>incoming deposit detected for <strong>".concat(res.locals.amount, " ").concat(settings.coin.ticker, "</strong><br>\nBalance will be reflected in your wallet in <strong>~").concat(settings.min.confirmations, "+ confirmations</strong><br>\n").concat(settings.coin.explorer, "/tx/").concat(res.locals.transaction[0].txid, "</p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font>\n</blockquote>")
  };
  return result;
};

exports.matrixIncomingDepositMessage = matrixIncomingDepositMessage;

var matrixDepositConfirmedMessage = function matrixDepositConfirmedMessage(amount) {
  var result = {
    body: "Deposit Confirmed \n".concat(amount, " ").concat(settings.coin.ticker, " has been credited to your wallet"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote>\n<p>Deposit Confirmed<br> \n".concat(amount, " ").concat(settings.coin.ticker, " has been credited to your wallet</p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font>\n</blockquote>")
  };
  return result;
}; /// /


exports.matrixDepositConfirmedMessage = matrixDepositConfirmedMessage;

var featureDisabledChannelMessage = function featureDisabledChannelMessage(name) {
  var result = {
    body: "This Feature has been disabled for this channel",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>This Feature has been disabled for this channel</strong></p>\n  <font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.featureDisabledChannelMessage = featureDisabledChannelMessage;

var featureDisabledServerMessage = function featureDisabledServerMessage(name) {
  var result = {
    body: "This Feature has been disabled for this server",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>This Feature has been disabled for this server</strong></p>\n  <font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.featureDisabledServerMessage = featureDisabledServerMessage;

var featureDisabledGlobalMessage = function featureDisabledGlobalMessage(name) {
  var result = {
    body: "This Feature has been disabled",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>This Feature has been disabled</strong></p>\n  <font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.featureDisabledGlobalMessage = featureDisabledGlobalMessage;

var settingsNotFoundMessage = function settingsNotFoundMessage(name) {
  var result = {
    body: "Settings not found!",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Settings not found!</strong></p>\n  <font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
}; ///


exports.settingsNotFoundMessage = settingsNotFoundMessage;

var confirmAllAmoutMessage = function confirmAllAmoutMessage(message, operationName, userBeingTipped) {
  var result = {
    body: "".concat(message.sender.name, ", are you sure that you want to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, "?\nAccepted answers: **yes/no/y/n**; \nAuto-cancel in 30 seconds."),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", are you sure that you want to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, "?<br>\nAccepted answers: **yes/no/y/n**;<br> \nAuto-cancel in 30 seconds.</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.confirmAllAmoutMessage = confirmAllAmoutMessage;

var canceledAllAmoutMessage = function canceledAllAmoutMessage(message, operationName, userBeingTipped) {
  var result = {
    body: "".concat(message.sender.name, ", you canceled the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", you canceled the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, "</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.canceledAllAmoutMessage = canceledAllAmoutMessage;

var timeOutAllAmoutMessage = function timeOutAllAmoutMessage(message, operationName, userBeingTipped) {
  var result = {
    body: "".concat(message.sender.name, ", the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, " has expired"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p>".concat(message.sender.name, ", the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, " has expired</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.timeOutAllAmoutMessage = timeOutAllAmoutMessage;

var walletNotFoundMessage = function walletNotFoundMessage(message, title) {
  var result = {
    body: "".concat(message.sender.name, ", Wallet not found"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", Wallet not found</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
}; /// /


exports.walletNotFoundMessage = walletNotFoundMessage;

var invalidAmountMessage = function invalidAmountMessage(message, title) {
  var result = {
    body: "".concat(message.sender.name, ", Invalid Amount"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", Invalid Amount</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.invalidAmountMessage = invalidAmountMessage;

var insufficientBalanceMessage = function insufficientBalanceMessage(message, title) {
  var result = {
    body: "".concat(message.sender.name, ", Insufficient balance"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", Insufficient balance</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.insufficientBalanceMessage = insufficientBalanceMessage;

var minimumMessage = function minimumMessage(message, setting, type) {
  var result = {
    body: "".concat(message.sender.name, ", Minimum ").concat(type, " is ").concat(setting.min / 1e8, " ").concat(settings.coin.ticker),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", Minimum ").concat(type, " is ").concat(setting.min / 1e8, " ").concat(settings.coin.ticker, "</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.minimumMessage = minimumMessage;

var errorMessage = function errorMessage(message, setting, type) {
  var result = {
    body: "Something went wrong.",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Something went wrong.</strong></p>\n  <font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.errorMessage = errorMessage;

var reviewMessage = function reviewMessage(message, transaction) {
  var amount = (transaction.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var fee = (transaction.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var total = ((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var result = {
    body: "".concat(message.sender.name, ",  Your withdrawal is being reviewed\n    \namount: ").concat(amount, "\nfee: ").concat(fee, "\ntotal: ").concat(total),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>\n    ".concat(message.sender.name, ",  Your withdrawal is being reviewed<br><br>\n    \namount: ").concat(amount, "<br>\nfee: ").concat(fee, "<br>\ntotal: ").concat(total, "<br>\n</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.reviewMessage = reviewMessage;

var invalidAddressMessage = function invalidAddressMessage(message) {
  var result = {
    body: "".concat(message.sender.name, ", Invalid Runebase Address"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(message.sender.name, ", Invalid Runebase Address</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.invalidAddressMessage = invalidAddressMessage;

var matrixWithdrawalAcceptedMessage = function matrixWithdrawalAcceptedMessage(updatedTrans) {
  var amount = (updatedTrans.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var fee = (updatedTrans.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var total = ((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var result = {
    body: "Your withdrawal has been accepted\n\namount: ".concat(amount, "\nfee: ").concat(fee, "\ntotal: ").concat(total, "\n    \n").concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>\nYour withdrawal has been accepted<br><br>\namount: ".concat(amount, "<br>\nfee: ").concat(fee, "<br>\ntotal: ").concat(total, "<br><br>\n    \n").concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid, "\n</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixWithdrawalAcceptedMessage = matrixWithdrawalAcceptedMessage;

var matrixWithdrawalConfirmedMessage = function matrixWithdrawalConfirmedMessage(userId, trans) {
  var result = {
    body: "Withdraw #".concat(trans.id, "\n").concat(userId, ", Your withdrawal has been complete"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><strong><h3>Withdraw #".concat(trans.id, "</h3><br><p>").concat(userId, ", Your withdrawal has been complete</p></strong>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixWithdrawalConfirmedMessage = matrixWithdrawalConfirmedMessage;

var nodeOfflineMessage = function nodeOfflineMessage() {
  var result = {
    body: "Runebase node is offline",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><strong><p>Runebase node is offline</p></strong>\n<font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.nodeOfflineMessage = nodeOfflineMessage;

var notInDirectMessage = function notInDirectMessage(message, title) {
  var result = {
    body: "".concat(title, "\n").concat(message.sender.name, ", Can't use this command in a direct message"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><strong><h6>".concat(title, "</h6><p>").concat(message.sender.name, ", Can't use this command in a direct message</p></strong>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
}; /// //


exports.notInDirectMessage = notInDirectMessage;

var matrixUserBannedMessage = function matrixUserBannedMessage(user) {
  var result = {
    body: "\uD83D\uDEAB     User: ".concat(user.username, " Banned     \uD83D\uDEAB\nReason:\n").concat(user.banMessage),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><h6>\uD83D\uDEAB     User: ".concat(user.username, " Banned     \uD83D\uDEAB</h6>\n<p><strong>Reason:<br>\n").concat(user.banMessage, "</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixUserBannedMessage = matrixUserBannedMessage;

var matrixRoomBannedMessage = function matrixRoomBannedMessage(server) {
  var result = {
    body: "\uD83D\uDEAB     Server Banned     \uD83D\uDEAB\nReason:\n".concat(server.banMessage),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote>\n<h6>\uD83D\uDEAB     Server Banned     \uD83D\uDEAB</h6>\n<p><strong>Reason:<br>\n".concat(server.banMessage, "</strong></p>\n  <font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.matrixRoomBannedMessage = matrixRoomBannedMessage;

var notEnoughUsers = function notEnoughUsers() {
  var result = {
    body: "not enough users",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>not enough users</strong></p>\n<font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.notEnoughUsers = notEnoughUsers;

var userListMessage = function userListMessage(list) {
  var result = {
    body: "".concat(list),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>".concat(list, "</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.userListMessage = userListMessage;

var afterSuccessMessage = function afterSuccessMessage(message, id, amount, withoutBots, amountPerUser, type, typeH) {
  var result = {
    body: "".concat(type, " #").concat(id, "\n").concat(message.sender.name, " ").concat(typeH, " **").concat(amount / 1e8, " ").concat(settings.coin.ticker, "** on ").concat(withoutBots.length, " users\n\uD83D\uDCB8 **").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, "** each \uD83D\uDCB8"),
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote>\n<h6>".concat(type, " #").concat(id, "</h6>\n<p><strong>").concat(message.sender.name, " ").concat(typeH, " **").concat(amount / 1e8, " ").concat(settings.coin.ticker, "** on ").concat(withoutBots.length, " users<br>\n\uD83D\uDCB8 **").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, "** each \uD83D\uDCB8</strong></p>\n<font color=\"").concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
}; /// /


exports.afterSuccessMessage = afterSuccessMessage;

var testMessage = function testMessage() {
  var result = {
    body: "Hello World",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: "<blockquote><p><strong>Hello Worlds</strong></p>\n<font color=\"".concat(settings.bot.color, "\">").concat(settings.bot.name, " v").concat(_package["default"].version, "</font></blockquote>")
  };
  return result;
};

exports.testMessage = testMessage;